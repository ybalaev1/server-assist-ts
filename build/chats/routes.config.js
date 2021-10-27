'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.chatsRoute = void 0;
var express_1 = require('express');
var auth_user_1 = require('../services/auth/controllers/auth.user');
var chats_controller_1 = require('./controllers/chats.controller');
var chatsRoute = function () {
        var app = express_1.Router();
        app.post('/chats/', [auth_user_1.validJWTNeeded, chats_controller_1.insertChat]);
        app.get('/chats/', [auth_user_1.validJWTNeeded, chats_controller_1.getChats]);
        app.post('/chats/:id', [auth_user_1.validJWTNeeded, chats_controller_1.postMessageChat]);
        app.get('/chats/:id', [auth_user_1.validJWTNeeded, chats_controller_1.getDataChatById]);
        app.get('/:id', [auth_user_1.validJWTNeeded, chats_controller_1.getConversationByRoomId]);
        app.get('/:id/read', [auth_user_1.validJWTNeeded, chats_controller_1.getMarkerRead]);
        app.put('/:id/mark-read', [auth_user_1.validJWTNeeded, chats_controller_1.markConversationReadByChatId]);
        app.delete('/messages/:id', [auth_user_1.validJWTNeeded, chats_controller_1.deleteMessage]);
        return app;
};
exports.chatsRoute = chatsRoute;
