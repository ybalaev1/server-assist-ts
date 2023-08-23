"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disablePaidEvent = exports.getUserImagesFromEvent = exports.updatedEvents = exports.refundPaymentEvent = exports.paidEvent = exports.getManagingEvents = exports.unSubscribeEvent = exports.subscribeEvent = exports.getEventById = exports.getEventsByCommunityId = exports.getAllEvents = exports.updateEvent = exports.insertEvent = exports.findById = exports.deleteEvent = void 0;
const user_model_1 = require("../../users/model/user.model");
const event_model_1 = require("../model/event.model");
const community_model_1 = require("../../communities/model/community.model");
const index_1 = require("../../index");
const findCustomerByEmail = async (email) => {
    try {
        const customer = await index_1.stripe.customers.list({
            email: email,
            limit: 1
        });
        if (customer.data.length !== 0) {
            return customer.data[0].id;
        }
    }
    catch (e) {
        return (e);
    }
};
const paidEvent = async (req, res, next) => {
    var _a, _b;
    const { paymentMethodType, paymentMethodOptions, jwt } = req.body;
    const { id } = req.params;
    const currency = 'USD';
    const event = await event_model_1.Event.findById({ _id: id }).exec();
    const customer = await user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
    const creator = await user_model_1.User.findById({ _id: event === null || event === void 0 ? void 0 : event.creator.uid }).exec();
    const seller = await findCustomerByEmail(creator === null || creator === void 0 ? void 0 : creator.email);
    const params = {
        payment_method_types: paymentMethodType === 'link' ? ['link', 'card'] : [paymentMethodType],
        amount: (_a = req.body) === null || _a === void 0 ? void 0 : _a.amount,
        automatic_payment_methods: {
            enabled: true,
        },
        currency: currency,
        customer: seller,
        receipt_email: customer === null || customer === void 0 ? void 0 : customer.email,
        metadata: {
            event: JSON.stringify({
                title: event === null || event === void 0 ? void 0 : event.title,
                description: event === null || event === void 0 ? void 0 : event.description,
                eventUid: event === null || event === void 0 ? void 0 : event.id,
                creator: event === null || event === void 0 ? void 0 : event.creator.name,
                location: event === null || event === void 0 ? void 0 : event.location
            })
        }
    };
    const paymentIntent = await index_1.stripe.paymentIntents.create(params);
    const newIntent = {
        id: paymentIntent.id,
        payed: true,
        userUid: jwt.userId,
        eventUid: id,
        event: {
            title: event === null || event === void 0 ? void 0 : event.title,
            description: event === null || event === void 0 ? void 0 : event.description,
            creator: event === null || event === void 0 ? void 0 : event.creator.name,
            place: event === null || event === void 0 ? void 0 : event.place,
            location: event === null || event === void 0 ? void 0 : event.location,
            eventDate: event === null || event === void 0 ? void 0 : event.eventDate,
        },
        user: {
            name: customer === null || customer === void 0 ? void 0 : customer.userName,
            gender: customer === null || customer === void 0 ? void 0 : customer.userGender,
            email: customer === null || customer === void 0 ? void 0 : customer.email,
        }
    };
    const paidEvents = ((_b = customer === null || customer === void 0 ? void 0 : customer.paidEvents) === null || _b === void 0 ? void 0 : _b.length) ? customer === null || customer === void 0 ? void 0 : customer.paidEvents.concat(newIntent) : [newIntent];
    await user_model_1.User.updateOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { paidEvents: paidEvents } });
    return res.status(200).json(Object.assign({ clientSecret: paymentIntent.client_secret }, paymentIntent));
};
exports.paidEvent = paidEvent;
const disablePaidEvent = async (req, res) => {
    const { jwt } = req.body;
    const { id } = req.params;
    const user = await user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
    const paidEvents = user === null || user === void 0 ? void 0 : user.paidEvents.filter(ticket => ticket.id !== id);
    await user_model_1.User.updateOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { paidEvents: paidEvents } });
    return res.status(200).json(Object.assign({ message: 'Ticker is deleted' }, paidEvents));
};
exports.disablePaidEvent = disablePaidEvent;
const refundPaymentEvent = async (req, res) => {
    var _a, _b;
    const { jwt } = req.body;
    const { id } = req.params;
    const customer = await user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
    const refund_id = (_a = customer === null || customer === void 0 ? void 0 : customer.paidEvents) === null || _a === void 0 ? void 0 : _a.find(event => event.id && event.eventUid === id);
    const refund = await index_1.stripe.refunds.create({
        payment_intent: refund_id === null || refund_id === void 0 ? void 0 : refund_id.id,
    });
    if ((refund === null || refund === void 0 ? void 0 : refund.status) === 'succeeded') {
        await user_model_1.User.updateOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { paidEvents: (_b = customer === null || customer === void 0 ? void 0 : customer.paidEvents) === null || _b === void 0 ? void 0 : _b.map(events => events).filter(event => event.id !== (refund_id === null || refund_id === void 0 ? void 0 : refund_id.id)) } });
        res.status(200).json(Object.assign({ message: 'succefuly' }, refund));
    }
};
exports.refundPaymentEvent = refundPaymentEvent;
const eventCreate = async (data) => new Promise((resolve) => {
    const event = event_model_1.Event.create(data);
    resolve(event);
});
const findById = async (req, res) => {
    const { id } = req.params;
    const event = await event_model_1.Event.findOne({ 'id': id });
    if (!event) {
        return res.status(404).json({ message: `Event not found`, code: 404 });
    }
    return res.status(200).json({ data: event });
};
exports.findById = findById;
const getEventById = async (req, res) => {
    var _a;
    const { id } = req.params;
    const event = await event_model_1.Event.findOne({ _id: id }).exec();
    const creator = await user_model_1.User.findOne({ 'id': (_a = event === null || event === void 0 ? void 0 : event.creator) === null || _a === void 0 ? void 0 : _a.uid }).exec();
    if (!event) {
        return res.status(404).json({ message: 'event not found' });
    }
    return res.status(200).json(Object.assign({}, event.toJSON()));
};
exports.getEventById = getEventById;
const getEventsByCommunityId = async (id) => {
    const community = await community_model_1.Community.findById({ 'id': id });
    if (community) {
        const events = await event_model_1.Event.find({ 'id': community === null || community === void 0 ? void 0 : community.eventsIds });
        return events;
    }
};
exports.getEventsByCommunityId = getEventsByCommunityId;
const getUserImagesFromEvent = async (req, res) => {
    const { id } = req.params;
    const event = await event_model_1.Event.findOne({ _id: id }).exec();
    const attendedPeople = event === null || event === void 0 ? void 0 : event.attendedPeople.map(i => i.userUid);
    const records = await user_model_1.User.find({ '_id': { $in: attendedPeople } }, 'userImage');
    return res.status(200).json(Object.assign({}, records));
};
exports.getUserImagesFromEvent = getUserImagesFromEvent;
const getAllEvents = async (req, res) => {
    const { location } = req.params;
    const events = await event_model_1.Event.find({ 'location': location }).exec();
    return res.status(200).json({ data: events, prevOffset: 1, prevLimit: 1 });
};
exports.getAllEvents = getAllEvents;
const insertEvent = async (req, res) => {
    var _a;
    const { data } = req.body;
    const { jwt } = req.body;
    const user = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId });
    const requestData = Object.assign(Object.assign({}, data), { creator: {
            uid: user === null || user === void 0 ? void 0 : user.id,
            image: (_a = user === null || user === void 0 ? void 0 : user.userImage) !== null && _a !== void 0 ? _a : null,
            name: user === null || user === void 0 ? void 0 : user.userName,
        }, attendedPeople: [{ userUid: user === null || user === void 0 ? void 0 : user.id }] });
    if (Number(data === null || data === void 0 ? void 0 : data.price) > 0) {
        const isAvailableCustomer = await findCustomerByEmail(user === null || user === void 0 ? void 0 : user.email);
        if (!isAvailableCustomer) {
            const customer = await index_1.stripe.customers.create({
                email: user === null || user === void 0 ? void 0 : user.email,
                name: user === null || user === void 0 ? void 0 : user.userName,
            });
            await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { customer: customer } });
        }
    }
    return eventCreate(requestData).then(async (event) => {
        var _a, _b;
        const community = await community_model_1.Community.findOne({ 'id': data.communityUid });
        const userEvents = !((_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.length) ? [event === null || event === void 0 ? void 0 : event._id] : [...user === null || user === void 0 ? void 0 : user.events, event === null || event === void 0 ? void 0 : event._id];
        const events = !((_b = community === null || community === void 0 ? void 0 : community.eventsIds) === null || _b === void 0 ? void 0 : _b.length) ? [event === null || event === void 0 ? void 0 : event._id] : [...community === null || community === void 0 ? void 0 : community.eventsIds, event === null || event === void 0 ? void 0 : event._id];
        await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { goingEvent: userEvents, events: userEvents } });
        await community_model_1.Community.updateOne({ 'id': data.communityUid }, { $set: { eventsIds: events } });
        await event_model_1.Event.updateOne({ _id: event === null || event === void 0 ? void 0 : event._id }, { 'id': event === null || event === void 0 ? void 0 : event._id });
        const dataEvent = Object.assign(Object.assign({}, event === null || event === void 0 ? void 0 : event.toJSON()), { id: event === null || event === void 0 ? void 0 : event._id });
        return res.status(200).json(Object.assign({}, dataEvent));
    });
};
exports.insertEvent = insertEvent;
const updateEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await event_model_1.Event.updateOne({ 'id': id }, req.body.data);
        const eventUpdated = await event_model_1.Event.findOne({ 'id': id }).exec();
        return res.status(200).send(Object.assign({}, eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON()));
    }
    catch (error) {
        return res.status(404).json({ message: 'Event not found', code: 404 });
    }
};
exports.updateEvent = updateEvent;
const getManagingEvents = async (req, res) => {
    const { jwt } = req.body;
    try {
        const eventsData = await event_model_1.Event.find().exec();
        const events = eventsData === null || eventsData === void 0 ? void 0 : eventsData.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.creator) === null || _a === void 0 ? void 0 : _a.uid) === (jwt === null || jwt === void 0 ? void 0 : jwt.userId); });
        return res.status(200).send({ data: events });
    }
    catch (error) {
        console.log('error', error);
        return res.status(404).json({ message: 'Event not found', code: 404 });
    }
};
exports.getManagingEvents = getManagingEvents;
const deleteEvent = async (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const { jwt } = req.body;
    const event = await event_model_1.Event.findOne({ 'id': id });
    const user = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId });
    const community = await community_model_1.Community.findOne({ 'id': event === null || event === void 0 ? void 0 : event.communityUid });
    const userEvents = (_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.filter(i => i !== id);
    const events = (_b = community === null || community === void 0 ? void 0 : community.eventsIds) === null || _b === void 0 ? void 0 : _b.filter(i => i !== id);
    await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { events: userEvents } });
    await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { goingEvent: userEvents } });
    await community_model_1.Community.updateOne({ 'id': event === null || event === void 0 ? void 0 : event.communityUid }, { $set: { eventsIds: events } });
    await event_model_1.Event.findOneAndDelete({ 'id': id });
    return res.status(200).json({ message: 'Event deleted successfully.' });
};
exports.deleteEvent = deleteEvent;
const updatedEvents = async (location) => {
    const events = await event_model_1.Event.find({ 'location': location }).exec();
    let allEvents = [];
    for (let index in events) {
        let currentEvent = events[index];
        const attendedPeople = currentEvent === null || currentEvent === void 0 ? void 0 : currentEvent.attendedPeople.map(i => i.userUid);
        const records = await user_model_1.User.find({ '_id': { $in: attendedPeople } }, 'userImage');
        const item = Object.assign(Object.assign({}, currentEvent.toJSON()), { userImages: records });
        allEvents.push(item);
    }
    return allEvents;
};
exports.updatedEvents = updatedEvents;
const subscribeEvent = async (eventUid, userUid) => {
    var _a, _b, _c, _d, _e;
    const event = await event_model_1.Event.findOne({ _id: eventUid }).exec();
    const user = await user_model_1.User.findOne({ _id: userUid }).exec();
    const isAvailable = ((_a = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _a === void 0 ? void 0 : _a.length) && (event === null || event === void 0 ? void 0 : event.attendedPeople.map(follower => follower).find(user => user.userUid === userUid));
    const newUser = { 'userUid': userUid };
    const newFollowers = event === null || event === void 0 ? void 0 : event.attendedPeople.concat(newUser);
    if (isAvailable) {
        const attendedPeople = (_b = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _b === void 0 ? void 0 : _b.filter(i => i.userUid !== userUid);
        const userGoingEvent = (_c = user === null || user === void 0 ? void 0 : user.goingEvent) === null || _c === void 0 ? void 0 : _c.filter(i => i !== eventUid);
        await event_model_1.Event.updateOne({ _id: eventUid }, { $set: { attendedPeople: attendedPeople } });
        await user_model_1.User.updateOne({ _id: userUid }, { $set: { goingEvent: userGoingEvent } });
        const eventUpdated = await event_model_1.Event.findOne({ _id: eventUid }).exec();
        const events = await updatedEvents(event.location);
        const data = {
            events: events,
            currentEvent: eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON(),
        };
        return data;
    }
    else {
        const userGoingEvent = !((_d = user === null || user === void 0 ? void 0 : user.goingEvent) === null || _d === void 0 ? void 0 : _d.length) ? [eventUid] : [...user === null || user === void 0 ? void 0 : user.goingEvent, eventUid];
        const attendedPeople = !((_e = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _e === void 0 ? void 0 : _e.length) ? [{ 'userUid': userUid }] : newFollowers;
        await user_model_1.User.updateOne({ _id: userUid }, { $set: { goingEvent: userGoingEvent } });
        await event_model_1.Event.updateOne({ _id: eventUid }, { $set: { attendedPeople: attendedPeople } });
        const eventUpdated = await event_model_1.Event.findOne({ _id: eventUid }).exec();
        const events = await updatedEvents(event === null || event === void 0 ? void 0 : event.location);
        const data = {
            events: events,
            currentEvent: eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON(),
        };
        return data;
    }
};
exports.subscribeEvent = subscribeEvent;
const unSubscribeEvent = async (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const { jwt } = req.body;
    const event = await event_model_1.Event.findOne({ 'id': id });
    const user = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId });
    const userUid = jwt === null || jwt === void 0 ? void 0 : jwt.userId;
    const userEvents = (_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.filter(i => i !== id);
    const attendedPeople = (_b = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _b === void 0 ? void 0 : _b.filter((i) => i.userUid !== userUid);
    await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { goingEvent: userEvents } });
    await event_model_1.Event.updateOne({ 'id': id }, { $set: { attendedPeople: attendedPeople } });
    const eventUpdated = await event_model_1.Event.findOne({ 'id': id });
    return res.status(200).send(Object.assign({}, eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON()));
};
exports.unSubscribeEvent = unSubscribeEvent;
