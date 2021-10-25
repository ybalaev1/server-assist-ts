import { Request, Response } from 'express';
import { User } from '../../users/model/user.model';
import { Chat, Message } from '../models/chats.model';
import { encrypt } from '../../services/crypto/encryption';
import { decrypt } from '../../services/crypto/decryption';

const createChat = async (data: string[]) => {
  const chat = await Chat.create(data);
  return chat;
};

const markMessageRead = async (chat_id: string, user: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return Message.updateMany(
      {
        chat_id,
        'readByRecipients.readByUserId': { $ne: user },
      },
      {
        $addToSet: {
          readByRecipients: { readByUserId: user },
        },
      },
      {
        multi: true,
      },
    );
  } catch (error) {
    throw error;
  }
};

const markConversationReadByChatId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body.jwt;
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(400).json({
        success: false,
        message: 'No chat exists for this id',
      });
    }

    const result = await markMessageRead(id, userId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const getDataChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { jwt } = req.body;
  const chat = await Chat.findById({ _id: id });
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }
  if (jwt.userId !== chat.users[0] && jwt.userId !== chat.users[1]) {
    return res.status(404).json({ message: 'Chat not found' });
  }
  if (chat.users[0] === jwt.userId && chat.users[1] === jwt.userId) {
    const last = decrypt(chat.latestMessage[0], id);
    const favoriteUser = {
      user: {
        fullName: 'Favorite messages',
      },
      latestMessage: last,
      favorite: true,
      id,
      chat,
    };
    return res.status(200).json({ data: favoriteUser });
  }
  const user = await User.findById({ _id: jwt.userId });
  // eslint-disable-next-line no-underscore-dangle
  const user_id = user?._id.toString();
  const currentUser = chat.users.filter((u) => u !== user_id).toString();
  const costumer = await User.findById({ _id: currentUser });
  const last = decrypt(chat.latestMessage[0], id);
  if (last) {
    const newDataChat = {
      user: {
        fullName: costumer?.fullName,
        image: costumer?.image,
      },
      latestMessage: last,
      chat,
    };
    return res.status(200).send({ data: newDataChat });
  }
  const newDataChat = {
    user: {
      fullName: costumer?.fullName,
      image: costumer?.image,
    },
    chat,
  };
  return res.status(200).send({ data: newDataChat });
};

const getChats = async (req: Request, res: Response) => {
  const { jwt } = req.body;
  const user = await User.findById({ _id: jwt.userId }).exec();
  // eslint-disable-next-line no-underscore-dangle
  const user_id = user?._id.toString();
  const data = await Chat.find({ users: user_id });
  const chat_messages = data;
  for (let i = 0; i < chat_messages.length; i++) {
    const element = chat_messages[i].latestMessage[0];
    // eslint-disable-next-line no-underscore-dangle
    const item = decrypt(element, chat_messages[i]._id);
    data[i].latestMessage = item;
  }
  res.status(200).json({ data });
};

const getMarkerRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const conversation = await Message.aggregate([
    { $match: { chat_id: id } },
    { $sort: { createdAt: -1 } },
    { $unwind: '$readByRecipients' },
    {
      $group: {
        _id: '$chat_id',
        chat_id: { $last: '$chat_id' },
        message: { $last: '$message' },
        readByRecipients: { $addToSet: '$readByRecipients' },
        createdAt: { $last: '$createdAt' },
      },
    },
  ]);
  return res.status(200).json({
    conversation,
  });
};

const getConversationByRoomId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { jwt } = req.body;
  const chat = await Chat.findById({ _id: id });
  if (!chat) {
    return res.status(400).json({
      message: 'No chat exists for this id',
    });
  }
  if (jwt.userId !== chat.users[0] && jwt.userId !== chat.users[1]) {
    return res.status(404).json({ message: 'Chat not found' });
  }
  const conversation = await Message.aggregate([
    { $match: { chat_id: id } },
    { $sort: { createdAt: 1 } },
    { $unwind: '$user_id' },
  ]);
  const chat_messages = conversation;
  for (let i = 0; i < chat_messages.length; i++) {
    const element = chat_messages[i].message[0];
    const item = decrypt(element, id);
    conversation[i].message = item;
  }
  return res.status(200).json({
    conversation,
  });
};

const createMessage = async (data: any) => {
  const hash = encrypt(data.message, data.chat_id);
  data.message = hash;
  const mes = await Message.create(data);
  // eslint-disable-next-line no-underscore-dangle
  const mess_id = mes?._id;
  const dec_message = decrypt(data.message, data.chat_id);
  const last_user = await User.findById({ _id: mes.user_id });
  const crntChat = await Chat.findById({ _id: data.chat_id });
  await Chat.replaceOne({ _id: data.chat_id }, {
    latestMessage: mes.message,
    users: crntChat?.users,
    last_user: last_user?.fullName,
    updatedAt: new Date(),
  });

  const recievedMessage = {
    message: dec_message,
    chat_id: mes.chat_id,
    user_id: mes.user_id,
    createdAt: mes.createdAt,
    _id: mess_id,
    readByRecipients: { readByUserId: mes.user_id },
  };

  return recievedMessage;
};

const lattestMessage = async (id: string) => {
  const conversation = await Message.find({ chat_id: id }).sort({ createdAt: 1 });

  const chat_messages = conversation;
  for (let i = 0; i < chat_messages.length; i++) {
    const element = chat_messages[i].message[0];
    const item = decrypt(element, id);
    conversation[i].message = item;
  }
  return conversation;
};

const insertChat = async (req: Request, res: Response) => {
  const { data } = req.body;
  const { userId } = req.body.jwt;
  if (!data) {
    return res.status(401).json({ message: 'Need data', code: 401 });
  }
  if (!data.costumer) {
    return res.status(401).json({ message: 'Need costumer', code: 401 });
  }

  if (!data.initiator) {
    return res.status(401).json({ message: 'Need initiator', code: 401 });
  }
  if (data.costumer === data.initiator) {
    data.favorite = true;
    data.user = {
      fullName: 'Favorite messages',
    };
  }
  data.users = [data.costumer, data.initiator];
  const currentUser = data.users.filter((u) => u !== userId).toString();
  const costumer = await User.findById({ _id: currentUser });
  data.user = {
    fullName: costumer?.fullName,
    image: costumer?.image,
  };
  return createChat(data).then((createdChat: any) => {
    res.status(200).send({ id: createdChat.id });
  });
};
const postMessageChat = async (req: Request, res: Response) => {
  const { data, jwt } = req.body;
  const { id } = req.params;
  const message_data = {
    message: data.message,
    user_id: jwt.userId,
    chat_id: id,
    createdAt: new Date(),
    readByRecipients: { readByUserId: jwt.userId },
  };

  return createMessage(message_data).then(async (createMess: any) => {
    const currentChat = await Chat.findById({ _id: id });
    const lastUser = await User.findById({ _id: jwt.userId });
    // eslint-disable-next-line no-underscore-dangle
    await Chat.replaceOne({ _id: currentChat?._id }, {
      latestMessage: createMess,
      last_user: lastUser?.fullName,
      users: currentChat?.users,
      updatedAt: new Date(),
    });
    res.status(200).send({ data: createMess });
  });
};

const getSocketTyping = async (user_id: string) => {
  const user = await User.findById({ _id: user_id });
  return user;
};

const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await Message.deleteOne({ _id: id });
  return res.status(200).json({ message });
};

export {
  insertChat, postMessageChat, getChats, getDataChatById, getConversationByRoomId,
  deleteMessage, markConversationReadByChatId, getMarkerRead, createMessage, lattestMessage,
  getSocketTyping,
};
