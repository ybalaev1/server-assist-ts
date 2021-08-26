"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const routes_config_1 = require("./users/routes.config");
const mongoose_service_1 = require("./services/mongoose.service");
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.status(200);
    }
    else {
        return next();
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/users', routes_config_1.userRoute());
app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});
app.listen((process.env.PORT || 5000), () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_service_1.connectToDatabase();
    console.log(`Application started on URL ${process.env.PORT}:${5000} 🎉`);
}));
//# sourceMappingURL=index.js.map