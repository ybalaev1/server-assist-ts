import mongosee, { Schema, Model, Document } from 'mongoose';

type ChatModel = Document & {
  users: string[],
  latestMessage: string[],
  last_user: string,
};
type MessageModel = Document & {
  chat_id: string,
  message: string,
  user_id: string,
  createdAt: Date,
};
const messageSchema = new Schema({
  chat_id: {
    type: Schema.Types.String,
    require: true,
  },
  message: {
    type: Schema.Types.String,
    require: true,
  },
  user_id: {
    type: Schema.Types.String,
    require: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    require: true,
  },
},
{
  timestamps: true,
  collection: 'messages',
});

const chatSchema = new Schema({
  users: {
    type: Schema.Types.Array,
    require: true,
  },
  latestMessage: {
    type: Schema.Types.Array,
    require: false,
  },
  last_user: {
    type: Schema.Types.String,
    require: false,
  },
},
{
  timestamps: true,
  collection: 'chats',
});
const Chat: Model<ChatModel> = mongosee.model<ChatModel>('Chat', chatSchema);
const Message: Model<MessageModel> = mongosee.model<MessageModel>('Message', messageSchema);
export {
  Chat, ChatModel, Message, MessageModel,
};
