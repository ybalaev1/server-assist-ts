"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
var express_1 = require("express");
var user_controller_1 = require("./controllers/user.controller");
var auth_user_1 = require("../services/auth/controllers/auth.user");
var userRoute = function () {
    var app = (0, express_1.Router)();
    app.post('/users/', user_controller_1.insertUser);
    app.get('/users/', [auth_user_1.validJWTNeeded, user_controller_1.getAllUsers]);
    app.get('/user/:email', user_controller_1.userExistByEmail);
    app.get('/users/:id', [auth_user_1.validJWTNeeded, user_controller_1.getUserById]);
    app.post('/users/:id/update', [auth_user_1.validJWTNeeded, user_controller_1.updateUser]);
    app.delete('/users/:id', [auth_user_1.validJWTNeeded, user_controller_1.deleteUser]);
    return app;
};
exports.userRoute = userRoute;
