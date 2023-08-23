"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constansRoute = void 0;
const express_1 = require("express");
const constants_controller_1 = require("./controllers/constants.controller");
const constansRoute = () => {
    const app = (0, express_1.Router)();
    app.get('/constants/', constants_controller_1.getConstants);
    return app;
};
exports.constansRoute = constansRoute;
