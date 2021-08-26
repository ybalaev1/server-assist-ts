"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./controllers/user.controller");
const userRoute = () => {
    const app = express_1.Router();
    app.post('/users/', user_controller_1.createUser);
    app.get('/users', user_controller_1.getAllUsers);
    app.get('/users/:id', user_controller_1.getUserById);
    app.patch('/users/:id', user_controller_1.updateUser);
    app.delete('/users/:id', user_controller_1.deleteUser);
    return app;
};
exports.userRoute = userRoute;
//# sourceMappingURL=routes.config.js.map