"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
var express_1 = require("express");
var user_controller_1 = require("./controllers/user.controller");
var userRoute = function () {
    var app = express_1.Router();
    app.post('/users/', user_controller_1.createUser);
    app.get('/users', user_controller_1.getAllUsers);
    app.get('/users/:id', user_controller_1.getUserById);
    app.patch('/users/:id', user_controller_1.updateUser);
    app.delete('/users/:id', user_controller_1.deleteUser);
    return app;
};
exports.userRoute = userRoute;
