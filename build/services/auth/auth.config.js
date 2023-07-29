"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
var express_1 = require("express");
var auth_user_1 = require("./controllers/auth.user");
var verify_user_1 = require("./middleware/verify.user");
var authRoute = function () {
    var app = (0, express_1.Router)();
    app.post('/auth_email/', [verify_user_1.matchUserAndPassword, auth_user_1.login]);
    app.post('/auth_social/', auth_user_1.login);
    app.post('/refresh/', auth_user_1.refreshPassword);
    return app;
};
exports.authRoute = authRoute;
