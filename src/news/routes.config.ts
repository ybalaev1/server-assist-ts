import { Router } from 'express';
import {
  findById, insertPostData, deletePost, getAllPosts,
} from './controllers/post.controller';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';
import { validPostFields } from './middleware/validField';

const newsRoute = () => {
  const app = Router();

  app.post('/news/', [
    validJWTNeeded, validPostFields, insertPostData,
  ]);
  // app.get('/news/', [
  //   validJWTNeeded, getAllPosts,
  // ]);
  app.get('/news/', [
    getAllPosts,
  ]);
  app.get('/news/:postId', [
    findById,
  ]);
  app.delete('/news/:postId', [
    findById, deletePost,
  ]);

  return app;
};

export { newsRoute };
