import { Router } from 'express';
// import { setFollowId, removeFollowId } from './controllers/update.user_info';
import { insertUser, deleteUser, getAllUsers, getUserById, updateUser, findByEmail, userExistByEmail, onChangeLocation, getTickets, getPaymentById } from './controllers/user.controller';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';

const userRoute = () => {
        const app = Router();

        app.post('/users/', insertUser);
        app.get('/users/', [validJWTNeeded, getAllUsers]);
        app.get('/tickets/', [validJWTNeeded, getTickets]);
        app.get('/tickets/:id', [validJWTNeeded, getPaymentById])
        app.get('/user/:email', userExistByEmail);
        app.get('/users/:id', [validJWTNeeded, getUserById]);
        app.post('/user/update', [validJWTNeeded, updateUser]);
        app.post('/user/update_county', [validJWTNeeded, onChangeLocation])
        app.delete('/users/:id', [validJWTNeeded, deleteUser]);
        // app.post('/users/:id/followers', [validJWTNeeded, setFollowId]);
        // app.delete('/users/:id/followers', [validJWTNeeded, removeFollowId]);
        
        return app;
};

export { userRoute };
