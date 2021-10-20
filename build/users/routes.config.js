"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
var express_1 = require("express");
var update_user_info_1 = require("./controllers/update.user_info");
var user_controller_1 = require("./controllers/user.controller");
var post_controller_1 = require("../news/controllers/post.controller");
var auth_user_1 = require("../services/auth/controllers/auth.user");
var userRoute = function () {
    var app = express_1.Router();
    app.post('/users/', user_controller_1.insertUser);
    app.get('/users/', [auth_user_1.validJWTNeeded, user_controller_1.getAllUsers]);
    // app.get('/users/', [getAllUsers]);
    app.get('/users/:id', [auth_user_1.validJWTNeeded, user_controller_1.getUserById]);
    app.get('/users/:id/posts', [auth_user_1.validJWTNeeded, post_controller_1.getPostsByUserFun]);
    app.post('/users/:id/update', [auth_user_1.validJWTNeeded, user_controller_1.updateUser]);
    app.delete('/users/:id', [auth_user_1.validJWTNeeded, user_controller_1.deleteUser]);
    app.post('/users/:id/followers', [auth_user_1.validJWTNeeded, update_user_info_1.setFollowId]);
    app.delete('/users/:id/followers', [auth_user_1.validJWTNeeded, update_user_info_1.removeFollowId]);
    return app;
};
exports.userRoute = userRoute;
