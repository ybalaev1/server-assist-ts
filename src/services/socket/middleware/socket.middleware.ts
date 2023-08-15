// import { createNoticeForUserId } from '../../../notice/controllers/notice.controller';
// import { createMessage, lattestMessage, getSocketTyping } from '../../../chats/controllers/chats.controller';

import { Community } from "../../../communities/model/community.model";
import { Socket } from "socket.io";
import { User } from "../../../users/model/user.model";
import { getCommunities, subscribeCommunity } from "../../../communities/controllers/community.controller";
import { subscribeEvent, updatedEvents } from "../../../events/controllers/events.controller";

const sockets = {};

const userInitCocket = (socket) => socket.on('init', (id) => {
    console.log('userInitCocket init', id);
  sockets[id] = socket;
});

const subscribeCommunitySocket = (socket: Socket, io) => socket.on('follow_community', async (communityUid: string, userUid: string) => {
    console.log('subscribeCommunity follow_community');
        const community = await subscribeCommunity(communityUid, userUid, socket);
        io.emit('subscribed', community);
        // io.on('subscribed', data => {
        //   console.log('subscribeCommunitySocket data', data);
        // })
        // socket.to(socket.id).emit('subscribed', community);
        // console.log('subscribeCommunitySocket', community);
    // return res.status(200).send({ ...communityUpdated?.toJSON() });
  });
  const updateCommunitySocket = (socket: Socket, io) => socket.on('joined_update', async (location: string) => {
    console.log('updateCommunitySocket joined_update', location);
    const updated_communities = await getCommunities(location);
        io.emit('updated_communities', updated_communities);
        // socket.emit('updated_communities', updated_communities);
        console.log('updateCommunitySocket updated_communities', updated_communities);
    // return res.status(200).send({ ...communityUpdated?.toJSON() });
  });

const subscribeEventSocket = (socket: Socket, io) => socket.on('follow_event', async (eventUid: string, userUid: string) => {
  console.log('subscribeEventSocket follow_event');
      const event = await subscribeEvent(eventUid, userUid);
      // console.log('subscribed_event', event);
      io.emit('subscribed_event', event);
});
const subscribedToUpdateEvents = (socket: Socket, io) => socket.on('updated_events', async () => {
  // console.log('subscribedToUpdateEvents')
  const events = await updatedEvents();
  // console.log('subscribedToUpdateEvents', events);
  io.emit('updated_data_events', events);
});
// const messagingSocket = (socket, type: string, io) => socket.on(type, async (msg) => {
//   const message = await createMessage(msg);
//   io.emit(type, message);
//   // createNoticeForUserId(msg, msg.user_id, type, socket);
// });

// const latestMessageSocket = (socket) => {
//   socket.on('latest', async (id: string) => {
//     const last = await lattestMessage(id);
//     socket.join(id);
    // socket.to(id).emit('latest', last);
//   });
// };

// const typpingUserSocket = (socket, io) => {
//   socket.on('typing', async (user: string) => {
//     const typing_user = await getSocketTyping(user);
//     // eslint-disable-next-line no-underscore-dangle
//     const message = {
//       message: `${typing_user?.fullName} typing...`,
//       // eslint-disable-next-line no-underscore-dangle
//       user_id: typing_user?._id,
//     };
//     io.emit('typing', message);
//   });
// };

export {
  userInitCocket, 
  subscribeCommunitySocket,
  updateCommunitySocket,
  subscribeEventSocket,
  subscribedToUpdateEvents,
//   messagingSocket, latestMessageSocket, typpingUserSocket,
};
