"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeEventSocket = exports.updateCommunitySocket = exports.subscribeCommunitySocket = exports.userInitCocket = void 0;
const community_controller_1 = require("../../../communities/controllers/community.controller");
const events_controller_1 = require("../../../events/controllers/events.controller");
const sockets = {};
const userInitCocket = (socket) => socket.on('init', (id) => {
    console.log('userInitCocket init', id);
    sockets[id] = socket;
});
exports.userInitCocket = userInitCocket;
const subscribeCommunitySocket = (socket, io) => socket.on('follow_community', async (communityUid, userUid) => {
    const community = await (0, community_controller_1.subscribeCommunity)(communityUid, userUid, socket);
    io.emit('subscribed', community);
});
exports.subscribeCommunitySocket = subscribeCommunitySocket;
const updateCommunitySocket = (socket, io) => socket.on('joined_update', async (location) => {
    const updated_communities = await (0, community_controller_1.getCommunities)(location);
    io.emit('updated_communities', updated_communities);
    console.log('updateCommunitySocket updated_communities', updated_communities);
});
exports.updateCommunitySocket = updateCommunitySocket;
const subscribeEventSocket = (socket, io) => socket.on('follow_event', async (eventUid, userUid) => {
    const event = await (0, events_controller_1.subscribeEvent)(eventUid, userUid);
    io.emit('subscribed_event', event);
});
exports.subscribeEventSocket = subscribeEventSocket;
