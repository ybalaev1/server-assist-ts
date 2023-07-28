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
exports.unSubscribeEvent = exports.subscribeEvent = exports.getEventById = exports.getEventsByCommunityId = exports.getAllEvents = exports.updateEvent = exports.insertEvent = exports.findById = exports.deleteEvent = void 0;
var user_model_1 = require("../../users/model/user.model");
var event_model_1 = require("../model/event.model");
var community_model_1 = require("../../communities/model/community.model");
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
    var id, event;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, event_model_1.Event.findOne({ 'id': id }).exec()];
            case 1:
                event = _a.sent();
                console.log('getEventById', id, event);
                if (!event) {
                    return [2, res.status(404).json({ message: 'event not found' })];
                }
                return [2, res.status(200).json(__assign({}, event === null || event === void 0 ? void 0 : event.toJSON()))];
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
var getAllEvents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, event_model_1.Event.find().exec()];
            case 1:
                events = _a.sent();
                return [2, res.status(200).json({ data: events })];
        }
    });
}); };
exports.getAllEvents = getAllEvents;
var insertEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, jwt, user, requestData;
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
                return [2, eventCreate(requestData).then(function (event) { return __awaiter(void 0, void 0, void 0, function () {
                        var community, userEvents, events, dataEvent;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4, community_model_1.Community.findOne({ 'id': data.communityUid })];
                                case 1:
                                    community = _c.sent();
                                    console.log('event create', event);
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
var subscribeEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                userEvents = !((_a = user === null || user === void 0 ? void 0 : user.events) === null || _a === void 0 ? void 0 : _a.length) ? [id] : __spreadArray(__spreadArray([], user === null || user === void 0 ? void 0 : user.events, true), [id], false);
                attendedPeople = !((_b = event === null || event === void 0 ? void 0 : event.attendedPeople) === null || _b === void 0 ? void 0 : _b.length) ? [userUid] : __spreadArray(__spreadArray([], event === null || event === void 0 ? void 0 : event.attendedPeople, true), [{ 'userUid': userUid }], false);
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
