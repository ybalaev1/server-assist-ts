import { Router } from 'express';
import { setFollowId, removeFollowId } from './controllers/update.user_info';
import { insertUser, deleteUser, getAllUsers, getUserById, updateUser } from './controllers/user.controller';
import { getPostsByUserFun } from '../news/controllers/post.controller';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';

const userRoute = () => {
        const app = Router();

        app.post('/users/', insertUser);
        app.get('/users/', [validJWTNeeded, getAllUsers]);
        // app.get('/users/', [getAllUsers]);
        app.get('/users/:id', [validJWTNeeded, getUserById]);
        app.get('/users/:id/posts', [validJWTNeeded, getPostsByUserFun]);
        app.post('/users/:id/update', [validJWTNeeded, updateUser]);
        app.delete('/users/:id', [validJWTNeeded, deleteUser]);
        app.post('/users/:id/followers', [validJWTNeeded, setFollowId]);
        app.delete('/users/:id/followers', [validJWTNeeded, removeFollowId]);

        return app;
};

export { userRoute };
