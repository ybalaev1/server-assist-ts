import e, { NextFunction, Request, Response } from 'express';
import { User } from '../../users/model/user.model';
import { Event, EventCreatedModel } from '../model/event.model';
import { Community } from '../../communities/model/community.model';
import { redisClient, stripe } from '../../index';

const findCustomerByEmail = async (email: string | undefined) => {
  try {
    const customer = await stripe.customers.list( {
      email: email,
      limit: 1
  });
   if(customer.data.length !== 0){
    return customer.data[0].id;
   }
  } catch (e) {
   return (e);
 }
};
const paidEvent = async (req: Request, res: Response, next: NextFunction) => {
  const {paymentMethodType, paymentMethodOptions, jwt} = req.body;
  const {id} = req.params;
  const currency = 'USD';
  const event = await Event.findById({ _id: id }).exec();
  const customer = await User.findOne({ _id: jwt?.userId }).exec();
  const creator = await User.findById({_id : event?.creator.uid}).exec();
  const seller = await findCustomerByEmail(creator?.email);
  const params = {
    payment_method_types: paymentMethodType === 'link' ? ['link', 'card'] : [paymentMethodType],
    amount: req.body?.amount,
    automatic_payment_methods: {
      enabled: true,
    },
    currency: currency,
    customer: seller,
    receipt_email: customer?.email,
    metadata: {
      event: JSON.stringify({
          title: event?.title,
          description: event?.description,
          eventUid: event?.id,
          creator: event?.creator.name,
          location: event?.location
    })}

  }
  const paymentIntent = await stripe.paymentIntents.create(params);
  const newIntent = {
    id: paymentIntent.id,
    payed: true,
    userUid: jwt.userId,
    eventUid: id,
    event: {
      title: event?.title,
      description: event?.description,
      creator: event?.creator.name,
      place: event?.place,
      location: event?.location,
      eventDate: event?.eventDate,
    },
    user: {
      name: customer?.userName,
      gender: customer?.userGender,
      email: customer?.email,
    }
  }
  // if (paymentIntent?.status === 'Succeeded') {
  const paidEvents = customer?.paidEvents?.length ? customer?.paidEvents.concat(newIntent) : [newIntent];
  
  await User.updateOne({ _id:jwt?.userId }, {$set: {paidEvents: paidEvents}})

  // console.log('paidEvent', paymentIntent);
  return res.status(200).json({
    clientSecret: paymentIntent.client_secret,
    // nextAction: paymentIntent.next_action,
    ...paymentIntent,
  });
}
const disablePaidEvent = async (req: Request, res: Response) => {
  const {jwt} = req.body;
  const {id} = req.params;
  const user = await User.findOne({ _id: jwt?.userId }).exec();
  const paidEvents = user?.paidEvents.filter(ticket => ticket.id !== id);
  await User.updateOne({ _id:jwt?.userId }, {$set: {paidEvents: paidEvents}})
  return res.status(200).json({ message: 'Ticker is deleted', ...paidEvents });
}
const refundPaymentEvent = async (req: Request, res: Response) => {
  const {jwt} = req.body;
  const { id } = req.params;
  const customer = await User.findOne({ _id: jwt?.userId }).exec();
  const refund_id = customer?.paidEvents?.find(event => event.id && event.eventUid === id);
  // console.log('refund_id', refund_id);
  const refund = await stripe.refunds.create({
    payment_intent: refund_id?.id,
  });
  // console.log('refund', refund);
  if (refund?.status === 'succeeded') {
    await User.updateOne({ _id: jwt?.userId }, {$set: {paidEvents: customer?.paidEvents?.map(events => events).filter(event => event.id !== refund_id?.id)}})
    res.status(200).json({ message: 'succefuly', ...refund})
  }
  // return refund;
};
const eventCreate = async (data: string[]) => new Promise((resolve) => {
  const event = Event.create(data);
  resolve(event);
});

const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findOne({ 'id': id });

  if (!event) {
    return res.status(404).json({ message: `Event not found`, code: 404 });
  }
  return res.status(200).json({ data: event });
};


const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findOne({ _id: id }).exec();
  const creator = await User.findOne({ 'id': event?.creator?.uid }).exec();

  //  const attendedPeople = event?.attendedPeople.map(i => i.userUid);
  //  const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage');

  // const data = {
  //   ...event?.toJSON(),
  //   userImages: records,
  //   creator: {
  //           ...event?.creator,
  //             image: creator?.userImage,
  //     },
  // }
    if (!event) {
      return res.status(404).json({ message: 'event not found' });
    }
    return res.status(200).json({ ...event.toJSON() });
};
const getEventsByCommunityId = async (id: string) => {
  const community = await Community.findById({ 'id': id });
  if (community) {
    const events = await Event.find({ 'id': community?.eventsIds})
    return events;
  }
};

const getUserImagesFromEvent = async(req:Request, res: Response) => {
  const {id} = req.params;
  const event = await Event.findOne({ _id: id}).exec();
  const attendedPeople = event?.attendedPeople.map(i => i.userUid);
  const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage');

  return res.status(200).json({...records});
}
const getAllEvents = async (req: Request, res: Response) => {
  const events = await Event.find({}).exec();
  // const {location} = req.params;
  // const events =  await Event.find({ 'location': location }).exec()
  // await redisClient.set('events', JSON.stringify(events));
    // let events;
  const eventsList = await redisClient.get('events');
  if(eventsList) {
    return res.status(200).json({ data: JSON.parse(eventsList) });
  } else {
    await redisClient.set('events', JSON.stringify(eventsList));
    return res.status(200).json({ data: events });
  }
  // const ev = await redisClient.get('events').then(res => console.log(res)).catch(er => console.log('err', er));
  // if (!ev) {
  //   const eventsList = await Event.find({}).exec();
  //   const list = eventsList.map(it => it);
  //   await redisClient.set('events', JSON.stringify(list))
  // //     for (let i = 0; i < list.length; i++) {
  // //     const item = list[i]
  // //     await redisClient.hSet('eventsList', 'events', JSON.stringify(item))
  // //     // await redisClient.lPush('events', `item:${item.id}`)
  // // }
  // // return res.status(404).json({ message: 'Events not found' });
  // return res.status(200).json({ data: events });
  
  //   // redisClient.lPush('events', JSON.stringify(eventsList));
  // } else {
    // if (eventsList) {
    //   console.log('available events', JSON.parse(eventsList));
    // } else {
    //   console.log('eventsList', eventsList);
    // }

    // return res.status(200).json({ data: events });
  // }
  // console.log('events', ev);

  // redisClient.GET('events', (reply) => {
  //   console.log('reply', reply);
  //   if (!reply) {
  //       return res.status(404).json({ message: 'Events not found' });
  //   } else {
  //     return res.status(200).json({ data: reply });
  //   }
  // })
  // const cachedEvents = redisClient.get('events');
  // if (cachedEvents) {
  //         events = JSON.parse(cachedEvents);
  //         // events = results.filter(event => event?.location === location);
  //  } else {
  //         // const eventsData = await Event.find({ 'location': location }).exec();
  //         const allEvents = await Event.find().exec();
  //         events = allEvents;
  //         redisClient.set('events', JSON.stringify(allEvents)); 
  // }

  // // console.log('cachedEvents', events?.length);
  // // redisClient.get('events', function(err, reply) {
  // //   const ev = JSON.parse(reply);
  // //   console.log('cachedEvents', ev?.length);
  // // });
  // if(!events?.length) {
          // return res.status(404).json({ message: 'Events not found' });
  // }
  // return res.status(200).json({ data: events });
  // const eventsList = events.forEach(async (item, index) => {
  //   const attendedPeople = item.attendedPeople?.map(i => i.userUid);
  //   const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage');
  //   const data = {
  //     ...item.toJSON(),
  //     userImages: records,
  //   }
  //   return data;
  // })
  /* pagination -----
  // const {offset, limit} = req.query;
  // // console.log('req', req.query)
  // const pageOptions = {
  //   limit: Number(req.query.limit) || 2,
  //   offset: Number(req.query.offset) || 0,
  // }
  // const difference = Math.abs(pageOptions.limit - pageOptions.offset);
  // const oldList =  await Event.find({ 'location': location }).limit(difference).skip(difference).exec();
  // const eventsList = await Event.find({ 'location': location }).limit(pageOptions.limit).skip(pageOptions.offset).exec();
  // const events = Event.find({ 'location': location }).limit(pageOptions.limit).skip(pageOptions.offset).cursor();

  // const results: any = [];
  // for (let doc = await events.next(); doc != null; doc = await events.next()) {
  //   results.push(doc);
  // }
  ------end
  */
  /* images in attended users  -----

//  let allEvents: any = [];
//  for (let index in eventsList){
//   let currentEvent = eventsList[index];
//   const attendedPeople = currentEvent?.attendedPeople.map(i => i.userUid);
//   const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage');
  // const item = {
  //   ...currentEvent.toJSON(),
  //   userImages: records,
  // }
//   allEvents.push(item);
//   // console.log('index', item);
// }
  */

// const newList = oldList.concat(...results);
// console.log('count', eventsList);

      // return res.status(200).json({ data: events, prevOffset: 1, prevLimit: 1 });

};

const insertEvent = async (req: Request, res: Response) => {
  const { data } = req.body;
  const { jwt } = req.body;
  const user = await User.findOne({ 'id': jwt?.userId });
  const requestData = {
          ...data,
          creator: {
                  uid: user?.id,
                  image: user?.userImage ?? null,
                  name: user?.userName,
          },
          attendedPeople: [{userUid: user?.id}]
  }
  // console.log('Number(data?.price) > 0', Number(data?.price) > 0);
  if (Number(data?.price) > 0) {
    const isAvailableCustomer = await findCustomerByEmail(user?.email);
    if (!isAvailableCustomer) {
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user?.userName,
      });
      await User.updateOne({ 'id': jwt?.userId }, {$set: {customer: customer}});
    }
  }
    return eventCreate(requestData).then(async(event: any) => {
      const community = await Community.findOne({ 'id': data.communityUid })

      const userEvents = !user?.events?.length ?  [event?._id] : [...user?.events, event?._id];
      const events = !community?.eventsIds?.length ?  [event?._id] : [...community?.eventsIds, event?._id];
      // await User.updateOne({ 'id': jwt?.userId }, {$set: {myCommunities: myCommunities}});
 
      await User.updateOne({ 'id': jwt?.userId }, {$set: {goingEvent: userEvents, events: userEvents}});
      // await User.updateOne({ 'id': jwt?.userId }, {$set: {events: userEvents}});
      await Community.updateOne({ 'id': data.communityUid }, {$set: {eventsIds: events}});
      await Event.updateOne({_id: event?._id}, {'id': event?._id});
                                // await Event.updateOne({ 'id': event?.id }, {$set: {id: event?.id}});
      const dataEvent = { 
        ...event?.toJSON(),
        id: event?._id,
        // product: product,
      }
      // console.log('make event', dataEvent);
      return res.status(200).json({ ...dataEvent });

    })
}

const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
          await Event.updateOne({ 'id': id }, req.body.data);
          const eventUpdated = await Event.findOne({ 'id': id }).exec();

          return res.status(200).send({ ...eventUpdated?.toJSON() });
  } catch (error) {
          return res.status(404).json({ message: 'Event not found', code: 404 });
  }
};
const getManagingEvents = async (req: Request, res: Response) => {
  const { jwt } = req.body;
  // console.log('jwt', jwt);
  try {
  const eventsData = await Event.find().exec();
  const events = eventsData?.filter((item) => item?.creator?.uid === jwt?.userId);
//   let allEvents: any = [];
//   for (let index in events){
//    let currentEvent = events[index];
//    const attendedPeople = currentEvent?.attendedPeople.map(i => i.userUid);
//    const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage');
//    const item = {
//      ...currentEvent.toJSON(),
//      userImages: records,
//    }
//    allEvents.push(item);
//    // console.log('index', item);
//  }
  return res.status(200).send({ data: events });
  } catch (error) {
          console.log('error', error)
          return res.status(404).json({ message: 'Event not found', code: 404 });
  }
}
const deleteEvent = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { jwt } = req.body;
        const event = await Event.findOne({ 'id': id });
        const user = await User.findOne({ 'id': jwt?.userId });
        const community = await Community.findOne({ 'id': event?.communityUid });

        const userEvents = user?.events?.filter(i => i !== id);
        const events = community?.eventsIds?.filter(i => i !== id);

        await User.updateOne({ 'id': jwt?.userId }, {$set: {events: userEvents}});
        await User.updateOne({ 'id': jwt?.userId }, {$set: {goingEvent: userEvents}});
        await Community.updateOne({ 'id': event?.communityUid }, {$set: {eventsIds: events}});
        await Event.findOneAndDelete({ 'id':id });

        return res.status(200).json({ message: 'Event deleted successfully.' });
};

const updatedEvents = async (location: string | undefined) => {
  const events = await Event.find({ 'location': location }).exec();
  // console.log('eev', events);
  let allEvents: any = [];
  for (let index in events){
   let currentEvent = events[index];
   const attendedPeople = currentEvent?.attendedPeople.map(i => i.userUid);
   const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage');
   const item = {
     ...currentEvent.toJSON(),
     userImages: records,
   }
   allEvents.push(item);
  //  console.log('index', item);
 }
//  const data = events.map(async ev => {
//   const event = await Event.findOne({ _id: ev.id}).exec();
//   const attendedPeople = event?.attendedPeople.map(i => i.userUid);
//   const records = await User.find({ '_id': { $in: attendedPeople } }, 'userImage').limit(3);
//   const data = {
//     ...event?.toJSON(),
//     images: records,
//   };
//   return data;
//   // return res.status(200).json({ data: items });

//  })
//  console.log('udpated', allEvents, events)
  return allEvents;
}
// const individualEvents = async (req: Request, res: Response) => {
//   const { jwt } = req.body;
//   const events = await Event.find().exec();
//   const user = await User.findOne({ _id: jwt?.userId }).exec();
//   const data = events.
// };

const subscribeEvent = async (eventUid: string, userUid: string) => {

  const event = await Event.findOne({ _id: eventUid}).exec();
  const user = await User.findOne({ _id: userUid}).exec();
  const isAvailable = event?.attendedPeople?.length && event?.attendedPeople.map(follower => follower).find(user => user.userUid === userUid);
  const newUser = {'userUid': userUid};
  const newFollowers = event?.attendedPeople.concat(newUser);
  // console.log('followers', newFollowers, community?.followers.map(follower => follower).find(user => user.userUid === userUid))
  if (isAvailable) {
          const attendedPeople = event?.attendedPeople?.filter(i => i.userUid !== userUid);
          const userGoingEvent = user?.goingEvent?.filter(i => i !== eventUid);
          await Event.updateOne({ _id: eventUid }, {$set: {attendedPeople: attendedPeople}});
          await User.updateOne({ _id: userUid }, {$set: {goingEvent: userGoingEvent}});
          const eventUpdated = await Event.findOne({ _id: eventUid }).exec();
          // const records = await User.find({ _id: { $in: eventUpdated?.attendedPeople.map(i => i.userUid) } }, 'userImage');
          const events = await updatedEvents(event.location);

          const data = {
                  events: events,
                  currentEvent: eventUpdated?.toJSON(),
                  // userImages: records,
          }
          return data;
  
  } else {

          const userGoingEvent = !user?.goingEvent?.length ?  [eventUid] : [...user?.goingEvent, eventUid];
          const attendedPeople = !event?.attendedPeople?.length ? [{'userUid': userUid}] : newFollowers;
          // console.log('followers', followers)
          await User.updateOne({ _id: userUid }, {$set: {goingEvent: userGoingEvent}});
          await Event.updateOne({ _id: eventUid }, {$set: {attendedPeople: attendedPeople}});
          const eventUpdated = await Event.findOne({ _id: eventUid }).exec();
          // const records = await User.find({ _id: { $in: newFollowers?.map(i => i.userUid) } }, 'userImage');
          const events = await updatedEvents(event?.location);
          const data = {
                  events: events,
                  currentEvent: eventUpdated?.toJSON(),
                  // userImages: records,
          }
          return data;
  }

}

const unSubscribeEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { jwt } = req.body;
  const event = await Event.findOne({ 'id': id});
  const user = await User.findOne({ 'id': jwt?.userId });
  
  const userUid = jwt?.userId;
  const userEvents = user?.events?.filter(i => i !== id);
  const attendedPeople = event?.attendedPeople?.filter((i: any) => i.userUid !== userUid);

  await User.updateOne({ 'id': jwt?.userId }, {$set: {goingEvent: userEvents}});
  await Event.updateOne({ 'id': id }, {$set: {attendedPeople: attendedPeople}});
  const eventUpdated = await Event.findOne({ 'id': id });

  return res.status(200).send({ ...eventUpdated?.toJSON() });
}
export {
  deleteEvent, findById, insertEvent, updateEvent, getAllEvents, getEventsByCommunityId, getEventById, subscribeEvent,
  unSubscribeEvent, getManagingEvents, paidEvent, refundPaymentEvent, updatedEvents, getUserImagesFromEvent, disablePaidEvent
};
