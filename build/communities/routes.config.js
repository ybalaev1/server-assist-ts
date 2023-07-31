"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communitiesRoute = void 0;
var express_1 = require("express");
var community_controller_1 = require("./controllers/community.controller");
var auth_user_1 = require("../services/auth/controllers/auth.user");
var communitiesRoute = function () {
    var app = (0, express_1.Router)();
    app.get('/communities/:location', community_controller_1.getAllCommunities);
    app.post('/communities/', [auth_user_1.validJWTNeeded, community_controller_1.insertCommunity]);
    app.post('/communities/:id/update', [auth_user_1.validJWTNeeded, community_controller_1.updateCommunity]);
    app.post('/communities/:id/subscribe', [auth_user_1.validJWTNeeded, community_controller_1.subscribeCommunity]);
    app.post('/communities/:id/unsubscribe', [auth_user_1.validJWTNeeded, community_controller_1.unSubscribeCommunity]);
    app.get('/managing_communities/', [auth_user_1.validJWTNeeded, community_controller_1.getManagingCommunities]);
    app.get('/community/:id', [auth_user_1.validJWTNeeded, community_controller_1.getCommunityById]);
    app.delete('/communities/:id', [auth_user_1.validJWTNeeded, community_controller_1.deleteCommunity]);
    return app;
};
exports.communitiesRoute = communitiesRoute;
