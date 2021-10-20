import { Router } from 'express';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';
import {
  getDataChatById, getChats, insertChat, postMessageChat, getConversationByRoomId, deleteMessage,
  markConversationReadByChatId, getMarkerRead,
} from './controllers/chats.controller';

const chatsRoute = () => {
  const app = Router();

  app.post('/chats/', [validJWTNeeded, insertChat]);
  app.get('/chats/', [validJWTNeeded, getChats]);
  app.post('/chats/:id', [validJWTNeeded, postMessageChat]);
  app.get('/chats/:id', [validJWTNeeded, getDataChatById]);
  app.get('/:id', [validJWTNeeded, getConversationByRoomId]);
  app.get('/:id/read', [validJWTNeeded, getMarkerRead]);
  app.put('/:id/mark-read', [validJWTNeeded, markConversationReadByChatId]);
  app.delete('/messages/:id', [validJWTNeeded, deleteMessage]);
  return app;
};

export { chatsRoute };
