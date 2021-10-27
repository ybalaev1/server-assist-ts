'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.noticeRoute = void 0;
var express_1 = require('express');
var auth_user_1 = require('../services/auth/controllers/auth.user');
var notice_controller_1 = require('./controllers/notice.controller');
var noticeRoute = function () {
        var app = express_1.Router();
        //   app.post('/notice/', [validJWTNeeded, insertChat]);
        app.get('/notice', [auth_user_1.validJWTNeeded, notice_controller_1.getNotifications]);
        //   app.delete('/messages/:id', [validJWTNeeded, deleteMessage]);
        return app;
};
exports.noticeRoute = noticeRoute;
