"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communitiesRoute = void 0;
var express_1 = require("express");
var community_controller_1 = require("./controllers/community.controller");
var communitiesRoute = function () {
    var app = (0, express_1.Router)();
    app.post('/communities/', community_controller_1.insertCommunity);
    app.get('/communities/', community_controller_1.getAllCommunities);
    app.delete('/communities/:id', community_controller_1.deleteCommunity);
    return app;
};
exports.communitiesRoute = communitiesRoute;
