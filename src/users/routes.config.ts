import { Router } from 'express';
import { setFollowId, removeFollowId } from './controllers/update.user_info';
import {
  insertUser, deleteUser, getAllUsers, getUserById, updateUser,
} from './controllers/user.controller';
import { getPostsByUserFun } from '../news/controllers/post.controller';

const userRoute = () => {
  const app = Router();

  app.post('/users/', insertUser);
  app.get('/users/', getAllUsers);
  // app.get('/users/', [getAllUsers]);
  app.get('/users/:id', [getUserById]);
  app.get('/users/:id/posts', [getPostsByUserFun]);
  app.patch('/users/:id', [updateUser]);
  app.delete('/users/:id', [deleteUser]);
  app.patch('/users/:id/followers', [setFollowId]);
  app.delete('/users/:id/followers', [removeFollowId]);

  return app;
};

export { userRoute };
