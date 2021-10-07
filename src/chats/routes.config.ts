import { Router } from 'express';
import {
  getChatById, getChats, insertChat, postMessageChat, getConversationByRoomId, deleteMessage,
} from './controllers/chats.controller';

const chatsRoute = () => {
  const app = Router();

  app.post('/chats/', insertChat);
  app.get('/chats/', getChats);
  app.post('/chats/:id', postMessageChat);
  app.get('/chats/:id', getChatById);
  app.get('/:id', getConversationByRoomId);
  app.delete('/messages/:id', deleteMessage);
  return app;
};

export { chatsRoute };
