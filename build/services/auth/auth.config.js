"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
var express_1 = require("express");
var auth_user_1 = require("./controllers/auth.user");
var verify_user_1 = require("./middleware/verify.user");
var authRoute = function () {
    var app = express_1.Router();
    app.post('/auth/', [
        verify_user_1.authValidFields,
        verify_user_1.matchUserAndPassword,
        auth_user_1.login,
    ]);
    app.post('/refresh/', auth_user_1.refreshPassword);
    return app;
};
exports.authRoute = authRoute;
