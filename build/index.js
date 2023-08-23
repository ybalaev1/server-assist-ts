"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.redisClient = exports.stripe = void 0;
const routes_config_1 = require("./users/routes.config");
const mongoose_service_1 = require("./services/mongoose.service");
const auth_config_1 = require("./services/auth/auth.config");
const socketMiddleware = __importStar(require("./services/socket/middleware/socket.middleware"));
const routes_config_2 = require("./communities/routes.config");
const routes_config_3 = require("./events/routes.config");
const constants_config_1 = require("./services/constans/constants.config");
const cors = require('cors');
const express = require('express');
const stripeKey = 'sk_test_51NVTpaEh2JOoqoGgfr2g2dUR9PNWbFVtENMBkCZ2NCLwhPVNt96Qg7ajdI7YCe92RK3mhIKYTrCtjlRsbiye5bMm00WKN05uGh';
const app = express();
exports.stripe = require('stripe')(stripeKey);
const redis = require('redis');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 500 }));
app.use(express.json());
app.use('/', (0, routes_config_1.userRoute)());
app.use('/', (0, auth_config_1.authRoute)());
app.use('/', (0, routes_config_2.communitiesRoute)());
app.use('/', (0, routes_config_3.eventsRoute)());
app.use('/', (0, constants_config_1.constansRoute)());
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    optionsSuccessStatus: 200,
    credentials: true,
}));
(async () => {
    exports.redisClient = redis.createClient();
    exports.redisClient.on("error", (error) => console.log('Что-то пошло не так', error));
    await exports.redisClient.connect();
})();
const server = app.listen(PORT, async () => {
    await (0, mongoose_service_1.connectToDatabase)();
    console.log(`Server running on port ${PORT}.`);
});
server.setTimeout(50000);
exports.io = require('socket.io')(server);
exports.io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socketMiddleware.subscribeCommunitySocket(socket, exports.io);
    socketMiddleware.subscribeEventSocket(socket, exports.io);
});
