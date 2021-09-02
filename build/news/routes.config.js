"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsRoute = void 0;
var express_1 = require("express");
var post_controller_1 = require("./controllers/post.controller");
var auth_user_1 = require("../services/auth/controllers/auth.user");
var validField_1 = require("./middleware/validField");
var newsRoute = function () {
    var app = express_1.Router();
    app.post('/news/', [
        auth_user_1.validJWTNeeded, validField_1.validPostFields, post_controller_1.insertPostData,
    ]);
    // app.get('/news/', [
    //   validJWTNeeded, getAllPosts,
    // ]);
    app.get('/news/', [
        post_controller_1.getAllPosts,
    ]);
    app.get('/news/:postId', [
        auth_user_1.validJWTNeeded, post_controller_1.findById,
    ]);
    app.delete('/news/:postId', [
        auth_user_1.validJWTNeeded, post_controller_1.findById, post_controller_1.deletePost,
    ]);
    return app;
};
exports.newsRoute = newsRoute;
