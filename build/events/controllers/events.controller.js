"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disablePaidEvent = exports.getUserImagesFromEvent = exports.updatedEvents = exports.refundPaymentEvent = exports.paidEvent = exports.getManagingEvents = exports.unSubscribeEvent = exports.subscribeEvent = exports.getEventById = exports.getEventsByCommunityId = exports.getAllEvents = exports.updateEvent = exports.insertEvent = exports.findById = exports.deleteEvent = void 0;
var user_model_1 = require("../../users/model/user.model");
var event_model_1 = require("../model/event.model");
var community_model_1 = require("../../communities/model/community.model");
var index_1 = require("../../index");
var findCustomerByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, index_1.stripe.customers.list({
                        email: email,
                        limit: 1
                    })];
            case 1:
                customer = _a.sent();
                if (customer.data.length !== 0) {
                    return [2, customer.data[0].id];
                }
                return [3, 3];
            case 2:
                e_1 = _a.sent();
                return [2, (e_1)];
            case 3: return [2];
        }
    });
}); };
var paidEvent = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, paymentMethodType, paymentMethodOptions, jwt, id, currency, event, customer, creator, seller, params, paymentIntent, newIntent, paidEvents;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, paymentMethodType = _a.paymentMethodType, paymentMethodOptions = _a.paymentMethodOptions, jwt = _a.jwt;
                id = req.params.id;
                currency = 'USD';
                return [4, event_model_1.Event.findById({ _id: id }).exec()];
            case 1:
                event = _d.sent();
                return [4, user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec()];
            case 2:
                customer = _d.sent();
                return [4, user_model_1.User.findById({ _id: event === null || event === void 0 ? void 0 : event.creator.uid }).exec()];
            case 3:
                creator = _d.sent();
                return [4, findCustomerByEmail(creator === null || creator === void 0 ? void 0 : creator.email)];
            case 4:
                seller = _d.sent();
                params = {
                    payment_method_types: paymentMethodType === 'link' ? ['link', 'card'] : [paymentMethodType],
                    amount: (_b = req.body) === null || _b === void 0 ? void 0 : _b.amount,
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
                return [4, index_1.stripe.paymentIntents.create(params)];
            case 5:
                paymentIntent = _d.sent();
                newIntent = {
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
                paidEvents = ((_c = customer === null || customer === void 0 ? void 0 : customer.paidEvents) === null || _c === void 0 ? void 0 : _c.length) ? customer === null || customer === void 0 ? void 0 : customer.paidEvents.concat(newIntent) : [newIntent];
                return [4, user_model_1.User.updateOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { paidEvents: paidEvents } })];
            case 6:
                _d.sent();
                return [2, res.status(200).json(__assign({ clientSecret: paymentIntent.client_secret }, paymentIntent))];
        }
    });
}); };
exports.paidEvent = paidEvent;
var disablePaidEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, id, user, paidEvents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = req.body.jwt;
                id = req.params.id;
                return [4, user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec()];
            case 1:
                user = _a.sent();
                paidEvents = user === null || user === void 0 ? void 0 : user.paidEvents.filter(function (ticket) { return ticket.id !== id; });
                return [4, user_model_1.User.updateOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { paidEvents: paidEvents } })];
            case 2:
                _a.sent();
                return [2, res.status(200).json(__assign({ message: 'Ticker is deleted' }, paidEvents))];
        }
    });
}); };
exports.disablePaidEvent = disablePaidEvent;
var refundPaymentEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, id, customer, refund_id, refund;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                jwt = req.body.jwt;
                id = req.params.id;
                return [4, user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec()];
            case 1:
                customer = _c.sent();
                refund_id = (_a = customer === null || customer === void 0 ? void 0 : customer.paidEvents) === null || _a === void 0 ? void 0 : _a.find(function (event) { return event.id && event.eventUid === id; });
                return [4, index_1.stripe.refunds.create({
                        payment_intent: refund_id === null || refund_id === void 0 ? void 0 : refund_id.id,
                    })];
            case 2:
                refund = _c.sent();
                if (!((refund === null || refund === void 0 ? void 0 : refund.status) === 'succeeded')) return [3, 4];
                return [4, user_model_1.User.updateOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { paidEvents: (_b = customer === null || customer === void 0 ? void 0 : customer.paidEvents) === null || _b === void 0 ? void 0 : _b.map(function (events) { return events; }).filter(function (event) { return event.id !== (refund_id === null || refund_id === void 0 ? void 0 : refund_id.id); }) } })];
            case 3:
                _c.sent();
                res.status(200).json(__assign({ message: 'succefuly' }, refund));
                _c.label = 4;
            case 4: return [2];
        }
    });
}); };
exports.refundPaymentEvent = refundPaymentEvent;
var eventCreate = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve) {
                var event = event_model_1.Event.create(data);
                resolve(event);
            })];
    });
}); };
var findById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, event_model_1.Event.findOne({ 'id': id })];
            case 1:
                event = _a.sent();
                if (!event) {
                    return [2, res.status(404).json({ message: "Event not found", code: 404 })];
                }
                return [2, res.status(200).json({ data: event })];
        }
    });
}); };
exports.findById = findById;
var getEventById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event, creator, attendedPeople, records, data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                return [4, event_model_1.Event.findOne({ _id: id }).exec()];
            case 1:
                event = _b.sent();
                return [4, user_model_1.User.findOne({ 'id': (_a = event === null || event === void 0 ? void 0 : event.creator) === null || _a === void 0 ? void 0 : _a.uid }).exec()];
            case 2:
                creator = _b.sent();
                attendedPeople = event === null || event === void 0 ? void 0 : event.attendedPeople.map(function (i) { return i.userUid; });
                return [4, user_model_1.User.find({ '_id': { $in: attendedPeople } }, 'userImage')];
            case 3:
                records = _b.sent();
                data = __assign(__assign({}, event === null || event === void 0 ? void 0 : event.toJSON()), { userImages: records, creator: __assign(__assign({}, event === null || event === void 0 ? void 0 : event.creator), { image: creator === null || creator === void 0 ? void 0 : creator.userImage }) });
                if (!event) {
                    return [2, res.status(404).json({ message: 'event not found' })];
                }
                return [2, res.status(200).json(__assign({}, data))];
        }
    });
}); };
exports.getEventById = getEventById;
var getEventsByCommunityId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var community, events;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, community_model_1.Community.findById({ 'id': id })];
            case 1:
                community = _a.sent();
                if (!community) return [3, 3];
                return [4, event_model_1.Event.find({ 'id': community === null || community === void 0 ? void 0 : community.eventsIds })];
            case 2:
                events = _a.sent();
                return [2, events];
            case 3: return [2];
        }
    });
}); };
exports.getEventsByCommunityId = getEventsByCommunityId;
var getUserImagesFromEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event, attendedPeople, records;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, event_model_1.Event.findOne({ _id: id }).exec()];
            case 1:
                event = _a.sent();
                attendedPeople = event === null || event === void 0 ? void 0 : event.attendedPeople.map(function (i) { return i.userUid; });
                return [4, user_model_1.User.find({ '_id': { $in: attendedPeople } }, 'userImage')];
            case 2:
                records = _a.sent();
                return [2, res.status(200).json({ images: records })];
        }
    });
}); };
exports.getUserImagesFromEvent = getUserImagesFromEvent;
var getAllEvents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var location, _a, offset, limit, eventsList;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                location = req.params.location;
                _a = req.query, offset = _a.offset, limit = _a.limit;
                console.log('req', req.query);
                return [4, event_model_1.Event.find({ 'location': location }).skip(Number(offset)).limit(Number(limit)).exec()];
            case 1:
                eventsList = _b.sent();
                console.log('count', eventsList.length);
                return [2, res.status(200).json({ data: eventsList, prevOffset: offset, prevLimit: limit })];
        }
    });
}); };
exports.getAllEvents = getAllEvents;
var insertEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, jwt, user, requestData, isAvailableCustomer, customer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = req.body.data;
                jwt = req.body.jwt;
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId })];
            case 1:
                user = _b.sent();
                requestData = __assign(__assign({}, data), { creator: {
                        uid: user === null || user === void 0 ? void 0 : user.id,
                        image: (_a = user === null || user === void 0 ? void 0 : user.userImage) !== null && _a !== void 0 ? _a : null,
                        name: user === null || user === void 0 ? void 0 : user.userName,
                    }, attendedPeople: [{ userUid: user === null || user === void 0 ? void 0 : user.id }] });
                if (!(Number(data === null || data === void 0 ? void 0 : data.price) > 0)) return [3, 5];
                return [4, findCustomerByEmail(user === null || user === void 0 ? void 0 : user.email)];
            case 2:
                isAvailableCustomer = _b.sent();
                if (!!isAvailableCustomer) return [3, 5];
                return [4, index_1.stripe.customers.create({
                        email: user === null || user === void 0 ? void 0 : user.email,
                        name: user === null || user === void 0 ? void 0 : user.userName,
                    })];
            case 3:
                customer = _b.sent();
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { customer: customer } })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2, eventCreate(requestData).then(function (event) { return __awaiter(void 0, void 0, void 0, function () {
                    var community, userEvents, events, dataEvent;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4, community_model_1.Community.findOne({ 'id': data.communityUid })];
                            case 1:
                                community = _c.sent();
                                userEvents = !((_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.length) ? [event === null || event === void 0 ? void 0 : event._id] : __spreadArray(__spreadArray([], user === null || user === void 0 ? void 0 : user.events, true), [event === null || event === void 0 ? void 0 : event._id], false);
                                events = !((_b = community === null || community === void 0 ? void 0 : community.eventsIds) === null || _b === void 0 ? void 0 : _b.length) ? [event === null || event === void 0 ? void 0 : event._id] : __spreadArray(__spreadArray([], community === null || community === void 0 ? void 0 : community.eventsIds, true), [event === null || event === void 0 ? void 0 : event._id], false);
                                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { goingEvent: userEvents, events: userEvents } })];
                            case 2:
                                _c.sent();
                                return [4, community_model_1.Community.updateOne({ 'id': data.communityUid }, { $set: { eventsIds: events } })];
                            case 3:
                                _c.sent();
                                return [4, event_model_1.Event.updateOne({ _id: event === null || event === void 0 ? void 0 : event._id }, { 'id': event === null || event === void 0 ? void 0 : event._id })];
                            case 4:
                                _c.sent();
                                dataEvent = __assign(__assign({}, event === null || event === void 0 ? void 0 : event.toJSON()), { id: event === null || event === void 0 ? void 0 : event._id });
                                return [2, res.status(200).json(__assign({}, dataEvent))];
                        }
                    });
                }); })];
        }
    });
}); };
exports.insertEvent = insertEvent;
var updateEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, eventUpdated, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4, event_model_1.Event.updateOne({ 'id': id }, req.body.data)];
            case 2:
                _a.sent();
                return [4, event_model_1.Event.findOne({ 'id': id }).exec()];
            case 3:
                eventUpdated = _a.sent();
                return [2, res.status(200).send(__assign({}, eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON()))];
            case 4:
                error_1 = _a.sent();
                return [2, res.status(404).json({ message: 'Event not found', code: 404 })];
            case 5: return [2];
        }
    });
}); };
exports.updateEvent = updateEvent;
var getManagingEvents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, eventsData, events, allEvents, _a, _b, _i, index, currentEvent, attendedPeople, records, item, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                jwt = req.body.jwt;
                console.log('jwt', jwt);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                return [4, event_model_1.Event.find().exec()];
            case 2:
                eventsData = _c.sent();
                events = eventsData === null || eventsData === void 0 ? void 0 : eventsData.filter(function (item) { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.creator) === null || _a === void 0 ? void 0 : _a.uid) === (jwt === null || jwt === void 0 ? void 0 : jwt.userId); });
                allEvents = [];
                _a = [];
                for (_b in events)
                    _a.push(_b);
                _i = 0;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3, 6];
                index = _a[_i];
                currentEvent = events[index];
                attendedPeople = currentEvent === null || currentEvent === void 0 ? void 0 : currentEvent.attendedPeople.map(function (i) { return i.userUid; });
                return [4, user_model_1.User.find({ '_id': { $in: attendedPeople } }, 'userImage')];
            case 4:
                records = _c.sent();
                item = __assign(__assign({}, currentEvent.toJSON()), { userImages: records });
                allEvents.push(item);
                _c.label = 5;
            case 5:
                _i++;
                return [3, 3];
            case 6: return [2, res.status(200).send({ data: allEvents })];
            case 7:
                error_2 = _c.sent();
                console.log('error', error_2);
                return [2, res.status(404).json({ message: 'User not found', code: 404 })];
            case 8: return [2];
        }
    });
}); };
exports.getManagingEvents = getManagingEvents;
var deleteEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, jwt, event, user, community, userEvents, events;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                jwt = req.body.jwt;
                return [4, event_model_1.Event.findOne({ 'id': id })];
            case 1:
                event = _c.sent();
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId })];
            case 2:
                user = _c.sent();
                return [4, community_model_1.Community.findOne({ 'id': event === null || event === void 0 ? void 0 : event.communityUid })];
            case 3:
                community = _c.sent();
                userEvents = (_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.filter(function (i) { return i !== id; });
                events = (_b = community === null || community === void 0 ? void 0 : community.eventsIds) === null || _b === void 0 ? void 0 : _b.filter(function (i) { return i !== id; });
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { events: userEvents } })];
            case 4:
                _c.sent();
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { goingEvent: userEvents } })];
            case 5:
                _c.sent();
                return [4, community_model_1.Community.updateOne({ 'id': event === null || event === void 0 ? void 0 : event.communityUid }, { $set: { eventsIds: events } })];
            case 6:
                _c.sent();
                return [4, event_model_1.Event.findOneAndDelete({ 'id': id })];
            case 7:
                _c.sent();
                return [2, res.status(200).json({ message: 'Event deleted successfully.' })];
        }
    });
}); };
exports.deleteEvent = deleteEvent;
var updatedEvents = function () { return __awaiter(void 0, void 0, void 0, function () {
    var events, allEvents, _a, _b, _i, index, currentEvent, attendedPeople, records, item;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, event_model_1.Event.find().exec()];
            case 1:
                events = _c.sent();
                allEvents = [];
                _a = [];
                for (_b in events)
                    _a.push(_b);
                _i = 0;
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3, 5];
                index = _a[_i];
                currentEvent = events[index];
                attendedPeople = currentEvent === null || currentEvent === void 0 ? void 0 : currentEvent.attendedPeople.map(function (i) { return i.userUid; });
                return [4, user_model_1.User.find({ '_id': { $in: attendedPeople } }, 'userImage')];
            case 3:
                records = _c.sent();
                item = __assign(__assign({}, currentEvent.toJSON()), { userImages: records });
                allEvents.push(item);
                _c.label = 4;
            case 4:
                _i++;
                return [3, 2];
            case 5: return [2, allEvents];
        }
    });
}); };
exports.updatedEvents = updatedEvents;
var subscribeEvent = function (eventUid, userUid) { return __awaiter(void 0, void 0, void 0, function () {
    var event, user, isAvailable, newUser, newFollowers, attendedPeople, userGoingEvent, eventUpdated, records, events, data, userGoingEvent, attendedPeople, eventUpdated, records, events, data;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4, event_model_1.Event.findOne({ _id: eventUid }).exec()];
            case 1:
                event = _f.sent();
                return [4, user_model_1.User.findOne({ _id: userUid }).exec()];
            case 2:
                user = _f.sent();
                isAvailable = ((_a = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _a === void 0 ? void 0 : _a.length) && (event === null || event === void 0 ? void 0 : event.attendedPeople.map(function (follower) { return follower; }).find(function (user) { return user.userUid === userUid; }));
                newUser = { 'userUid': userUid };
                newFollowers = event === null || event === void 0 ? void 0 : event.attendedPeople.concat(newUser);
                if (!isAvailable) return [3, 8];
                attendedPeople = (_b = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _b === void 0 ? void 0 : _b.filter(function (i) { return i.userUid !== userUid; });
                userGoingEvent = (_c = user === null || user === void 0 ? void 0 : user.goingEvent) === null || _c === void 0 ? void 0 : _c.filter(function (i) { return i !== eventUid; });
                return [4, event_model_1.Event.updateOne({ _id: eventUid }, { $set: { attendedPeople: attendedPeople } })];
            case 3:
                _f.sent();
                return [4, user_model_1.User.updateOne({ _id: userUid }, { $set: { goingEvent: userGoingEvent } })];
            case 4:
                _f.sent();
                return [4, event_model_1.Event.findOne({ _id: eventUid }).exec()];
            case 5:
                eventUpdated = _f.sent();
                return [4, user_model_1.User.find({ _id: { $in: eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.attendedPeople.map(function (i) { return i.userUid; }) } }, 'userImage')];
            case 6:
                records = _f.sent();
                return [4, updatedEvents()];
            case 7:
                events = _f.sent();
                data = {
                    events: events,
                    currentEvent: eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON(),
                    userImages: records,
                };
                return [2, data];
            case 8:
                userGoingEvent = !((_d = user === null || user === void 0 ? void 0 : user.goingEvent) === null || _d === void 0 ? void 0 : _d.length) ? [eventUid] : __spreadArray(__spreadArray([], user === null || user === void 0 ? void 0 : user.goingEvent, true), [eventUid], false);
                attendedPeople = !((_e = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _e === void 0 ? void 0 : _e.length) ? [{ 'userUid': userUid }] : newFollowers;
                return [4, user_model_1.User.updateOne({ _id: userUid }, { $set: { goingEvent: userGoingEvent } })];
            case 9:
                _f.sent();
                return [4, event_model_1.Event.updateOne({ _id: eventUid }, { $set: { attendedPeople: attendedPeople } })];
            case 10:
                _f.sent();
                return [4, event_model_1.Event.findOne({ _id: eventUid }).exec()];
            case 11:
                eventUpdated = _f.sent();
                return [4, user_model_1.User.find({ _id: { $in: newFollowers === null || newFollowers === void 0 ? void 0 : newFollowers.map(function (i) { return i.userUid; }) } }, 'userImage')];
            case 12:
                records = _f.sent();
                return [4, updatedEvents()];
            case 13:
                events = _f.sent();
                data = {
                    events: events,
                    currentEvent: eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON(),
                    userImages: records,
                };
                return [2, data];
        }
    });
}); };
exports.subscribeEvent = subscribeEvent;
var unSubscribeEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, jwt, event, user, userUid, userEvents, attendedPeople, eventUpdated;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                jwt = req.body.jwt;
                return [4, event_model_1.Event.findOne({ 'id': id })];
            case 1:
                event = _c.sent();
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId })];
            case 2:
                user = _c.sent();
                userUid = jwt === null || jwt === void 0 ? void 0 : jwt.userId;
                userEvents = (_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.filter(function (i) { return i !== id; });
                attendedPeople = (_b = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _b === void 0 ? void 0 : _b.filter(function (i) { return i.userUid !== userUid; });
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { goingEvent: userEvents } })];
            case 3:
                _c.sent();
                return [4, event_model_1.Event.updateOne({ 'id': id }, { $set: { attendedPeople: attendedPeople } })];
            case 4:
                _c.sent();
                return [4, event_model_1.Event.findOne({ 'id': id })];
            case 5:
                eventUpdated = _c.sent();
                return [2, res.status(200).send(__assign({}, eventUpdated === null || eventUpdated === void 0 ? void 0 : eventUpdated.toJSON()))];
        }
    });
}); };
exports.unSubscribeEvent = unSubscribeEvent;
