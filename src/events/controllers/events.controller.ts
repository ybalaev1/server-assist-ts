import { Request, Response } from 'express';
import { User } from '../../users/model/user.model';
import { Event, EventCreatedModel } from '../model/event.model';
import { Community } from '../../communities/model/community.model';

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
  

  if (!event) {
          return res.status(404).json({ message: 'event not found' });
  }
  return res.status(200).json({ ...event?.toJSON()});
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

  return res.status(200).json({ data: events });
};

const insertEvent = async (req: Request, res: Response) => {
  const { data } = req.body;
  const { jwt } = req.body;
  const user = await User.findById({ 'id': jwt?.userId });
  const requestData = {
          ...data,
          creator: {
                  uid: user?.id,
                  image: user?.userImage ?? null,
                  name: user?.userName,
          },
          attendedPeople: [{uid: user?.id}]
  }
    return eventCreate(requestData).then(async(event: any) => {
      const user = await User.findById({ 'id': jwt?.userId });
      const community = await Community.findById({ 'id': data.communityUid })

      const userEvents = !user?.events?.length ?  [event?.id] : [...user?.events, event?.id];
      const events = !community?.eventsIds?.length ?  [event?.id] : [...community?.eventsIds, event?.id];

      await User.updateOne({ 'id': jwt?.userId }, {$set: {goingEvent: userEvents}});
      await User.updateOne({ 'id': jwt?.userId }, {$set: {events: userEvents}});
      await Community.updateOne({ 'id': data.communityUid }, {$set: {eventsIds: events}});
      await Event.updateOne({ 'id': event?.id }, {$set: {id: event?.id}});
      
      return res.status(200).json({ ...event?.toJSON() });

    })
}

const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
          await Event.updateOne({ 'id': id }, req.body.data);
          const eventUpdated = await Event.findById({ 'id': id });

          return res.status(200).send({ data: eventUpdated });
  } catch (error) {
          return res.status(404).json({ message: 'Event not found', code: 404 });
  }
};
const deleteEvent = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { jwt } = req.body;
        const event = await Event.findOne({ 'id': id });
        const user = await User.findOne({ 'id': jwt?.userId });
        const community = await Community.findOne({ 'id': event?.communityUid });

        const userEvents = user?.events?.filter(i => i.toString() !== id);
        const events = community?.eventsIds?.filter(i => i.toString() !== id);

        await User.updateOne({ 'id': jwt?.userId }, {$set: {events: userEvents}});
        await User.updateOne({ 'id': jwt?.userId }, {$set: {goingEvent: userEvents}});
        await Community.updateOne({ 'id': event?.communityUid }, {$set: {eventsIds: events}});
        await Event.findOneAndDelete({ 'id':id });

        return res.status(200).json({ message: 'Event deleted successfully.' });
};
const subscribeEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { jwt } = req.body;
  const event = await Event.findOne({ 'id': id});
  const user = await User.findOne({ 'id': jwt?.userId });
  
  const userUid = jwt?.userId;
  const userEvents = !user?.events?.length ?  [id] : [...user?.events, id];
  const attendedPeople = !event?.attendedPeople?.length ? [userUid] : [...event?.attendedPeople, {'userUid': userUid}];

  await User.updateOne({ 'id': jwt?.userId }, {$set: {goingEvent: userEvents}});
  await Event.updateOne({ 'id': id }, {$set: {attendedPeople: attendedPeople}});
  const eventUpdated = await Event.findOne({ 'id': id });

  return res.status(200).send({ ...eventUpdated?.toJSON() });
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
  unSubscribeEvent
};
