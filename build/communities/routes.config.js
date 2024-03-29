"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communitiesRoute = void 0;
const express_1 = require("express");
const community_controller_1 = require("./controllers/community.controller");
const auth_user_1 = require("../services/auth/controllers/auth.user");
const communitiesRoute = () => {
    const app = (0, express_1.Router)();
    app.get('/communities/:location', community_controller_1.getAllCommunities);
    app.post('/communities/', [auth_user_1.validJWTNeeded, community_controller_1.insertCommunity]);
    app.post('/communities/:id/update', [auth_user_1.validJWTNeeded, community_controller_1.updateCommunity]);
    app.post('/communities/:id/unsubscribe', [auth_user_1.validJWTNeeded, community_controller_1.unSubscribeCommunity]);
    app.get('/managing_communities/', [auth_user_1.validJWTNeeded, community_controller_1.getManagingCommunities]);
    app.get('/community/:id/attended-people-images', [auth_user_1.validJWTNeeded, community_controller_1.getUserImagesFromCommunity]);
    app.get('/community/:id', [auth_user_1.validJWTNeeded, community_controller_1.getCommunityById]);
    app.delete('/communities/:id', [auth_user_1.validJWTNeeded, community_controller_1.deleteCommunity]);
    return app;
};
exports.communitiesRoute = communitiesRoute;
