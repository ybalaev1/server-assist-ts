"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_user_1 = require("./controllers/auth.user");
const verify_user_1 = require("./middleware/verify.user");
const authRoute = () => {
    const app = (0, express_1.Router)();
    app.post('/auth_email/', [verify_user_1.matchUserAndPassword, auth_user_1.login]);
    app.post('/auth_social/', auth_user_1.login);
    app.post('/refresh/', [auth_user_1.validJWTNeeded, auth_user_1.refreshPassword]);
    return app;
};
exports.authRoute = authRoute;
