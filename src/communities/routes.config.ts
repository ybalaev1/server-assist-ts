import { Router } from 'express';
import { deleteCommunity, getAllCommunities, getCommunityById, getManagingCommunities, getUserImagesFromCommunity, insertCommunity, subscribeCommunity, unSubscribeCommunity, updateCommunity } from './controllers/community.controller';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';

const communitiesRoute = () => {
        const app = Router();

        // app.post('/communities/', insertCommunity);
        app.get('/communities/:location', getAllCommunities);
        app.post('/communities/', [validJWTNeeded, insertCommunity]);
        app.post('/communities/:id/update', [validJWTNeeded, updateCommunity]);
        // app.post('/communities/:id/subscribe', [validJWTNeeded, subscribeCommunity]);
        app.post('/communities/:id/unsubscribe', [validJWTNeeded, unSubscribeCommunity]);
        app.get('/managing_communities/', [validJWTNeeded, getManagingCommunities]);
        app.get('/community/:id/attended-people-images', [validJWTNeeded, getUserImagesFromCommunity])

        app.get('/community/:id', [validJWTNeeded, getCommunityById]);
        app.delete('/communities/:id', [validJWTNeeded, deleteCommunity]);

        return app;
};

export { communitiesRoute };
