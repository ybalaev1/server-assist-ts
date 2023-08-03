// import { createNoticeForUserId } from '../../../notice/controllers/notice.controller';
// import { createMessage, lattestMessage, getSocketTyping } from '../../../chats/controllers/chats.controller';

import { Community } from "../../../communities/model/community.model";
import { Socket } from "socket.io";
import { User } from "../../../users/model/user.model";
import { subscribeCommunity } from "../../../communities/controllers/community.controller";

const sockets = {};

const userInitCocket = (socket) => socket.on('init', (id) => {
    console.log('userInitCocket init', id);
  sockets[id] = socket;
});

const subscribeCommunitySocket = (socket: Socket, io) => socket.on('follow_community', async (communityUid: string, userUid: string) => {
    console.log('subscribeCommunity follow_community', communityUid, userUid);
        const community = await subscribeCommunity(communityUid, userUid);
        io.emit('subscribed', community);
        // socket.to(socket.id).emit('subscribed', community);
        // console.log('subscribeCommunitySocket', community);
    // return res.status(200).send({ ...communityUpdated?.toJSON() });
  })
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
  subscribeCommunitySocket
//   messagingSocket, latestMessageSocket, typpingUserSocket,
};
