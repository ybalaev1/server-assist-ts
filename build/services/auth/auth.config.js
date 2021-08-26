"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
var express_1 = require("express");
var verify_user_1 = require("./middleware/verify.user");
var authRoute = function () {
    var app = express_1.Router();
    app.post('/auth/', [
        verify_user_1.authValidFields,
        verify_user_1.matchUserAndPassword,
    ]);
    return app;
};
exports.authRoute = authRoute;
