import { Router } from 'express';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';
import { setFollowId, removeFollowId } from './controllers/update.user_info';
import {
  insertUser, deleteUser, getAllUsers, getUserById, updateUser,
} from './controllers/user.controller';

const userRoute = () => {
  const app = Router();

  app.post('/users/', insertUser);
  app.get('/users', [validJWTNeeded, getAllUsers]);
  app.get('/users/:id', [validJWTNeeded, getUserById]);
  app.patch('/users/:id', [validJWTNeeded, updateUser]);
  app.delete('/users/:id', [validJWTNeeded, deleteUser]);
  app.patch('/users/:id/followers', [validJWTNeeded, setFollowId]);
  app.delete('/users/:id/followers', [validJWTNeeded, removeFollowId]);

  return app;
};

export { userRoute };
