import { Request, Response } from 'express';
import { User } from '../../users/model/user.model';
import { Chat, Message } from '../models/chats.model';

const getChats = async (req: Request, res: Response) => {
  const user = await User.findById({ _id: req.query.id }).exec();
  // eslint-disable-next-line no-underscore-dangle
  const user_id = user?._id.toString();
  const currentChat = await Chat.find({ users: { $in: user_id } });
  return res.status(200).json({ data: currentChat });
};

const getChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const chat = await Chat.findById({ _id: id });
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }
  if (chat.users[0] === req.query.user && chat.users[1] === req.query.user) {
    const favoriteUser = {
      user: {
        fullName: 'Favorite messages',
        image: 'favor',
      },
      id,
      chat,
      last_user: chat?.last_user,
    };
    return res.status(200).json({ data: favoriteUser });
  }
  const user = await User.findById({ _id: req.query.user });
  // eslint-disable-next-line no-underscore-dangle
  const user_id = user?._id.toString();
  const currentUser = chat.users.filter((u) => u !== user_id).toString();
  const costumer = await User.findById({ _id: currentUser });
  const newDataChat = {
    user: {
      fullName: costumer?.fullName,
      image: costumer?.image,
    },
    id,
    chat,
    last_user: chat?.last_user,
  };
  return res.status(200).json({ data: newDataChat });
};

const getConversationByRoomId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const chat = await Chat.findById({ _id: id });
  if (!chat) {
    return res.status(400).json({
      message: 'No chat exists for this id',
    });
  }
  const conversation = await Message.aggregate([
    { $match: { chat_id: id } },
    { $sort: { createdAt: 1 } },
    { $unwind: '$user_id' },
    // { $sort: { createdAt: 1 } },
    // { $skip: 14 },
    // { $limit: 10 },
  ]);

  // console.log(conversation, chat.users);
  return res.status(200).json({
    conversation,
  });

  // const aggregate = await Chat.aggregate([
  // { $match : { id } },
  //   { $sort : { createdAt - 1} },
  //   {
  //     $lookup: {
  //       from : 'users',
  //       localField : 'user_id',
  //       foreignField: '_id',
  //       as: 'user_id',
  //     }
  //   },
  // { $unwind: 'user_id' },
  // { $skip : options.page * options.limit },
  // { $limit : options.limit },
    // { $sort : createdAt: 1 },
  // ]);
};

const createChat = async (data: string[]) => {
  const chat = await Chat.create(data);
  return chat;
};
const createMessage = async (data: string[]) => {
  const message = await Message.create(data);
  return message;
};

const insertChat = async (req: Request, res: Response) => {
  const { data } = req.body;
  data.users = [data.costumer, data.initiator];

  return createChat(data).then((createdChat: any) => {
    res.status(200).send({ id: createdChat.id });
  });
};
const postMessageChat = async (req: Request, res: Response) => {
  const { data } = req.body;
  return createMessage(data).then(async (createMess: any) => {
    const currentChat = await Chat.findById({ _id: createMess.chat_id });
    const lastUser = await User.findById({ _id: createMess.user_id });
    await Chat.replaceOne({ _id: currentChat?._id }, {
      latestMessage: createMess.message,
      last_user: lastUser?.fullName,
      users: currentChat?.users,
    });
    res.status(200).send({ data: createMess });
  });
};

const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await Message.deleteOne({ _id: id });
  return res.status(200).json({ message });
};

export {
  insertChat, postMessageChat, getChats, getChatById, getConversationByRoomId,
  deleteMessage,
};
