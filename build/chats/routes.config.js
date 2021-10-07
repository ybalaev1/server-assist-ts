"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatsRoute = void 0;
var express_1 = require("express");
var chats_controller_1 = require("./controllers/chats.controller");
var chatsRoute = function () {
    var app = express_1.Router();
    app.post('/chats/', chats_controller_1.insertChat);
    app.get('/chats/', chats_controller_1.getChats);
    app.post('/chats/:id', chats_controller_1.postMessageChat);
    app.get('/chats/:id', chats_controller_1.getChatById);
    app.get('/:id', chats_controller_1.getConversationByRoomId);
    app.delete('/messages/:id', chats_controller_1.deleteMessage);
    return app;
};
exports.chatsRoute = chatsRoute;
