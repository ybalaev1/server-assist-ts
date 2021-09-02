"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
var express_1 = require("express");
var update_user_info_1 = require("./controllers/update.user_info");
var user_controller_1 = require("./controllers/user.controller");
var userRoute = function () {
    var app = express_1.Router();
    app.post('/users/', user_controller_1.insertUser);
    app.get('/users/', user_controller_1.getAllUsers);
    // app.get('/users/', [getAllUsers]);
    app.get('/users/:id', [user_controller_1.getUserById]);
    app.patch('/users/:id', [user_controller_1.updateUser]);
    app.delete('/users/:id', [user_controller_1.deleteUser]);
    app.patch('/users/:id/followers', [update_user_info_1.setFollowId]);
    app.delete('/users/:id/followers', [update_user_info_1.removeFollowId]);
    return app;
};
exports.userRoute = userRoute;
