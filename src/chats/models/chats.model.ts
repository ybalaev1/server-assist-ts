import mongosee, { Schema, Model, Document } from 'mongoose';

type ChatModel = Document & {
        users: string[];
        latestMessage:
                | any
                | {
                          iv: string;
                          encryptedData: string;
                  };
        favorite: boolean;
        last_user: string;
        user: {
                fullName?: string;
                image?: string;
        };
        createdAt: Date;
        updatedAt: Date;
};
type readByRecipientModel = Document & {
        readByUserId: string;
        readAt: Date;
};

const readByRecipientSchema = new Schema<readByRecipientModel>(
  {
    readByUserId: {
      type: Schema.Types.String,
      require: true,
    },
    readAt: {
      type: Schema.Types.Date,
      require: true,
      default: new Date(),
    },
  },
  {
    timestamps: false,
  },
);

type MessageModel = Document & {
        chat_id: string;
        message:
                | any
                | {
                          iv: string;
                          encryptedData: string;
                  };
        user_id: string;
        createdAt: Date;
        readByRecipients: typeof readByRecipientSchema;
};
const messageSchema = new Schema(
  {
    chat_id: {
      type: Schema.Types.String,
      require: true,
    },
    message: {
      type: Schema.Types.Array,
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
    readByRecipients: {
      type: readByRecipientSchema,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: 'messages',
  },
);
const chatSchema = new Schema(
  {
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
    user: {
      type: Schema.Types.Array,
      require: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: new Date(),
      require: true,
    },
    updatedAt: {
      type: Schema.Types.Date,
      require: true,
    },
    favorite: {
      type: Schema.Types.Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: false,
    collection: 'chats',
  },
);
const Chat: Model<ChatModel> = mongosee.model<ChatModel>('Chat', chatSchema);
const Message: Model<MessageModel> = mongosee.model<MessageModel>('Message', messageSchema);
export {
  Chat, ChatModel, Message, MessageModel,
};
