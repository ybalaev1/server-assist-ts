import { Router } from 'express';
import { deleteCommunity, getAllCommunities, insertCommunity } from './controllers/community.controller';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';

const communitiesRoute = () => {
        const app = Router();

        app.post('/communities/', insertCommunity);
        // app.get('/communities/', [validJWTNeeded, getAllCommunities]);
        app.get('/communities/', getAllCommunities);
        app.delete('/communities/:id', deleteCommunity);

        return app;
};

export { communitiesRoute };
