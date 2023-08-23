"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribedToUpdateEvents = exports.subscribeEventSocket = exports.updateCommunitySocket = exports.subscribeCommunitySocket = exports.userInitCocket = void 0;
var community_controller_1 = require("../../../communities/controllers/community.controller");
var events_controller_1 = require("../../../events/controllers/events.controller");
var sockets = {};
var userInitCocket = function (socket) { return socket.on('init', function (id) {
    console.log('userInitCocket init', id);
    sockets[id] = socket;
}); };
exports.userInitCocket = userInitCocket;
var subscribeCommunitySocket = function (socket, io) { return socket.on('follow_community', function (communityUid, userUid) { return __awaiter(void 0, void 0, void 0, function () {
    var community;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('subscribeCommunity follow_community');
                return [4, (0, community_controller_1.subscribeCommunity)(communityUid, userUid, socket)];
            case 1:
                community = _a.sent();
                io.emit('subscribed', community);
                return [2];
        }
    });
}); }); };
exports.subscribeCommunitySocket = subscribeCommunitySocket;
var updateCommunitySocket = function (socket, io) { return socket.on('joined_update', function (location) { return __awaiter(void 0, void 0, void 0, function () {
    var updated_communities;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('updateCommunitySocket joined_update', location);
                return [4, (0, community_controller_1.getCommunities)(location)];
            case 1:
                updated_communities = _a.sent();
                io.emit('updated_communities', updated_communities);
                console.log('updateCommunitySocket updated_communities', updated_communities);
                return [2];
        }
    });
}); }); };
exports.updateCommunitySocket = updateCommunitySocket;
var subscribeEventSocket = function (socket, io) { return socket.on('follow_event', function (eventUid, userUid) { return __awaiter(void 0, void 0, void 0, function () {
    var event;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('subscribeEventSocket follow_event');
                return [4, (0, events_controller_1.subscribeEvent)(eventUid, userUid)];
            case 1:
                event = _a.sent();
                io.emit('subscribed_event', event);
                return [2];
        }
    });
}); }); };
exports.subscribeEventSocket = subscribeEventSocket;
var subscribedToUpdateEvents = function (socket, io) { return socket.on('updated_events', function () { return __awaiter(void 0, void 0, void 0, function () {
    var events;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, events_controller_1.updatedEvents)()];
            case 1:
                events = _a.sent();
                io.emit('updated_data_events', events);
                return [2];
        }
    });
}); }); };
exports.subscribedToUpdateEvents = subscribedToUpdateEvents;
