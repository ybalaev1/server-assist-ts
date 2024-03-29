"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./controllers/user.controller");
const auth_user_1 = require("../services/auth/controllers/auth.user");
const userRoute = () => {
    const app = (0, express_1.Router)();
    app.post('/users/', user_controller_1.insertUser);
    app.get('/users/', [auth_user_1.validJWTNeeded, user_controller_1.getAllUsers]);
    app.get('/tickets/', [auth_user_1.validJWTNeeded, user_controller_1.getTickets]);
    app.get('/tickets/:id', [auth_user_1.validJWTNeeded, user_controller_1.getPaymentById]);
    app.get('/user/:email', user_controller_1.userExistByEmail);
    app.get('/users/:id', [auth_user_1.validJWTNeeded, user_controller_1.getUserById]);
    app.post('/user/update', [auth_user_1.validJWTNeeded, user_controller_1.updateUser]);
    app.post('/user/update_county', [auth_user_1.validJWTNeeded, user_controller_1.onChangeLocation]);
    app.delete('/users/:id', [auth_user_1.validJWTNeeded, user_controller_1.deleteUser]);
    return app;
};
exports.userRoute = userRoute;
