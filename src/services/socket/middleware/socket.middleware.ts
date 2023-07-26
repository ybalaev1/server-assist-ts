// // import { createNoticeForUserId } from '../../../notice/controllers/notice.controller';
// import { createMessage, lattestMessage, getSocketTyping } from '../../../chats/controllers/chats.controller';

// const sockets = {};

// const userInitCocket = (socket) => socket.on('init', (id) => {
//   sockets[id] = socket;
// });

// const messagingSocket = (socket, type: string, io) => socket.on(type, async (msg) => {
//   const message = await createMessage(msg);
//   io.emit(type, message);
//   // createNoticeForUserId(msg, msg.user_id, type, socket);
// });

// const latestMessageSocket = (socket) => {
//   socket.on('latest', async (id: string) => {
//     const last = await lattestMessage(id);
//     socket.join(id);
//     socket.to(id).emit('latest', last);
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

// export {
//   userInitCocket, messagingSocket, latestMessageSocket, typpingUserSocket,
// };
