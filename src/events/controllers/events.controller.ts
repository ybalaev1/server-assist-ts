import { NextFunction, Request, Response } from 'express';
import { User } from '../../users/model/user.model';
import { Event, EventCreatedModel } from '../model/event.model';
import { Community } from '../../communities/model/community.model';
import { stripe } from '../../index';

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
  }
  const paymentIntent = await stripe.paymentIntents.create(params);
  const newIntent = {
    id: paymentIntent.id,
    payed: true,
    userUid: jwt.userId,
    eventUid: id,
  }
  await User.updateOne({ _id:jwt?.userId }, {$set: {paidEvents: customer?.paidEvents.concat(newIntent)}})
  res.json({
    clientSecret: paymentIntent.client_secret,
    // nextAction: paymentIntent.next_action,
    ...paymentIntent,
  }).status(200);
  console.log('paidEvent', paymentIntent);
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
  const event = await Event.findOne({ 'id': id }).exec();
  // console.log('getEventById', id, event);
  const creator = await User.findOne({ 'id': event?.creator?.uid }).exec();
  if (event?.product_info) {
    const product = await stripe.products.retrieve(event?.product_info?.id);
    const data = {
            ...event?.toJSON(),
            creator: {
                    ...event?.creator,
                    image: creator?.userImage,
            },
            product_id: product?.id,
    }
    res.status(200).json({ ...data });
  } else {
    const data = {
          ...event?.toJSON(),
          creator: {
                  ...event?.creator,
                  image: creator?.userImage,
          },
    }

    return res.status(200).json({ ...data });
  }

  if (!event) {
          return res.status(404).json({ message: 'event not found' });
  }
};
const getEventsByCommunityId = async (id: string) => {
  const community = await Community.findById({ 'id': id });
  if (community) {
    const events = await Event.find({ 'id': community?.eventsIds})
    return events;
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  const events = await Event.find().exec();
  const data = events.map(async (event) => {
    return {
      ...event,
      users: event?.attendedPeople?.map(async user => {
        const userData = await User.findOne({ _id: user.userUid}).exec();
        return userData;
      })
    }
    // const usersImages = event?.attendedPeople?.map(async user => {
    //   const userData = await User.findOne({ _id: user.userUid}).exec();
    //   return userData;
    // });
    // console.log('usersImages', usersImages);
    // return {
    //   ...event,
    //   usersImages: usersImages,
    // };
  })

  return res.status(200).json({ data: events });
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
  if (Number(data?.price) > 0) {
    const isAvailableCustomer = await findCustomerByEmail(user?.email);
    if (!isAvailableCustomer) {
      await stripe.customers.create({
        email: user?.email,
        name: user?.userName,
      });
    }
  }
    return eventCreate(requestData).then(async(event: any) => {
      const community = await Community.findOne({ 'id': data.communityUid })
      // console.log('event create', event);
      let product: {
        id: '',
        name: '',
        description: '',
        default_price_data: {
            unit_amount: 0,
            unit_amount_decimal: 0,
            currency: 'USD',
          },
          metadata: { 
            'eventUid' : '', 
          },
      } ;
  if (Number(data?.price) > 0) {
    const amount = new Number(data?.price);
    product = await stripe.products.create({
      name: data?.title,
      description: data?.description,
      default_price_data: {
          unit_amount: amount,
          unit_amount_decimal: Math.floor(data.price * 100),
          currency: 'USD',
        },
        metadata: { 
          'eventUid' : JSON.stringify(event._id) 
        },
    });
    await Event.updateOne({ _id: event._id}, {$set: {product_info: product}});
  }

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
  console.log('jwt', jwt);
  try {
  const eventsData = await Event.find().exec();
  const events = eventsData?.filter((item) => item?.creator?.uid === jwt?.userId);

  return res.status(200).send({ data: events });
  } catch (error) {
          console.log('error', error)
          return res.status(404).json({ message: 'User not found', code: 404 });
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

const updatedEvents = async () => {
  const events = await Event.find().exec();
  return events;
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
          const eventUpdated = await Event.findOne({ _id: eventUid });
          const events = await Event.find().exec();
          const data = {
                  events: events,
                  currentEvent: eventUpdated?.toJSON(),
          }
          return data;
  
  } else {

          const userGoingEvent = !user?.goingEvent?.length ?  [eventUid] : [...user?.goingEvent, eventUid];
          const attendedPeople = !event?.attendedPeople?.length ? [{'userUid': userUid}] : newFollowers;
          // console.log('followers', followers)
          await User.updateOne({ _id: userUid }, {$set: {goingEvent: userGoingEvent}});
          await Event.updateOne({ _id: eventUid }, {$set: {attendedPeople: attendedPeople}});
          const eventUpdated = await Event.findOne({ _id: eventUid });
          const events = await Event.find().exec();
          const data = {
                  events: events,
                  currentEvent: eventUpdated?.toJSON(),
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
  unSubscribeEvent, getManagingEvents, paidEvent, refundPaymentEvent, updatedEvents
};
