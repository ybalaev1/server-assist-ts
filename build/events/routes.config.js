"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoute = void 0;
var express_1 = require("express");
var events_controller_1 = require("./controllers/events.controller");
var auth_user_1 = require("../services/auth/controllers/auth.user");
var eventsRoute = function () {
    var app = (0, express_1.Router)();
    app.post('/events/', [auth_user_1.validJWTNeeded, events_controller_1.insertEvent]);
    app.post('/events/:id/update', [auth_user_1.validJWTNeeded, events_controller_1.updateEvent]);
    app.post('/events/:id/subscribe', [auth_user_1.validJWTNeeded, events_controller_1.subscribeEvent]);
    app.post('/events/:id/unsubscribe', [auth_user_1.validJWTNeeded, events_controller_1.unSubscribeEvent]);
    app.get('/events/', [auth_user_1.validJWTNeeded, events_controller_1.getAllEvents]);
    app.get('/events/:id', [auth_user_1.validJWTNeeded, events_controller_1.getEventById]);
    app.delete('/events/:id', [auth_user_1.validJWTNeeded, events_controller_1.deleteEvent]);
    return app;
};
exports.eventsRoute = eventsRoute;
