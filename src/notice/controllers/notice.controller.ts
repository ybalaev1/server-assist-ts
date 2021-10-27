import { Request, Response } from 'express';
import { decrypt } from '../../services/crypto/decryption';
import { User } from '../../users/model/user.model';
import { Chat } from '../../chats/models/chats.model';
import { Notice } from '../model/notice.model';

const getNotifications = async (req: Request, res: Response) => {
  const { jwt } = req.body;
  const notice = await Notice.find({ user: jwt.userId });
  res.status(200).json({ notice });
};

const createNoticeForUserId = async (data: string[] | any,
  user_id: string, type: string, socket) => {
  const chat = await Chat.findById({ _id: data.chat_id });
  // eslint-disable-next-line no-underscore-dangle
  const reciever_user = chat?.users.filter((u) => u !== user_id).toString();
  const sender_user = await User.findById({ _id: user_id });
  // eslint-disable-next-line no-underscore-dangle
  const message = decrypt(data.message, chat?._id);
  const notice = {
    message: `${message}`,
    title: `${sender_user?.fullName}`,
    user: reciever_user,
    type,
  };

  const new_notice = await Notice.create(notice);
  socket.to(data.chat_id).emit('new_push', new_notice);
  //   console.log(data, user_id, new_notice);
};

export { getNotifications, createNoticeForUserId };
