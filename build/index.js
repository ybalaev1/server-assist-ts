'use strict';
var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
                ? function (o, m, k, k2) {
                          if (k2 === undefined) k2 = k;
                          Object.defineProperty(o, k2, {
                                  enumerable: true,
                                  get: function () {
                                          return m[k];
                                  },
                          });
                  }
                : function (o, m, k, k2) {
                          if (k2 === undefined) k2 = k;
                          o[k2] = m[k];
                  });
var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
                ? function (o, v) {
                          Object.defineProperty(o, 'default', { enumerable: true, value: v });
                  }
                : function (o, v) {
                          o['default'] = v;
                  });
var __importStar =
        (this && this.__importStar) ||
        function (mod) {
                if (mod && mod.__esModule) return mod;
                var result = {};
                if (mod != null)
                        for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                __setModuleDefault(result, mod);
                return result;
        };
var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
                function adopt(value) {
                        return value instanceof P
                                ? value
                                : new P(function (resolve) {
                                          resolve(value);
                                  });
                }
                return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) {
                                try {
                                        step(generator.next(value));
                                } catch (e) {
                                        reject(e);
                                }
                        }
                        function rejected(value) {
                                try {
                                        step(generator['throw'](value));
                                } catch (e) {
                                        reject(e);
                                }
                        }
                        function step(result) {
                                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                        }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
        };
var __generator =
        (this && this.__generator) ||
        function (thisArg, body) {
                var _ = {
                                label: 0,
                                sent: function () {
                                        if (t[0] & 1) throw t[1];
                                        return t[1];
                                },
                                trys: [],
                                ops: [],
                        },
                        f,
                        y,
                        t,
                        g;
                return (
                        (g = { next: verb(0), throw: verb(1), return: verb(2) }),
                        typeof Symbol === 'function' &&
                                (g[Symbol.iterator] = function () {
                                        return this;
                                }),
                        g
                );
                function verb(n) {
                        return function (v) {
                                return step([n, v]);
                        };
                }
                function step(op) {
                        if (f) throw new TypeError('Generator is already executing.');
                        while (_)
                                try {
                                        if (
                                                ((f = 1),
                                                y &&
                                                        (t =
                                                                op[0] & 2
                                                                        ? y['return']
                                                                        : op[0]
                                                                        ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                                                                        : y.next) &&
                                                        !(t = t.call(y, op[1])).done)
                                        )
                                                return t;
                                        if (((y = 0), t)) op = [op[0] & 2, t.value];
                                        switch (op[0]) {
                                                case 0:
                                                case 1:
                                                        t = op;
                                                        break;
                                                case 4:
                                                        _.label++;
                                                        return { value: op[1], done: false };
                                                case 5:
                                                        _.label++;
                                                        y = op[1];
                                                        op = [0];
                                                        continue;
                                                case 7:
                                                        op = _.ops.pop();
                                                        _.trys.pop();
                                                        continue;
                                                default:
                                                        if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                                                                _ = 0;
                                                                continue;
                                                        }
                                                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                                                _.label = op[1];
                                                                break;
                                                        }
                                                        if (op[0] === 6 && _.label < t[1]) {
                                                                _.label = t[1];
                                                                t = op;
                                                                break;
                                                        }
                                                        if (t && _.label < t[2]) {
                                                                _.label = t[2];
                                                                _.ops.push(op);
                                                                break;
                                                        }
                                                        if (t[2]) _.ops.pop();
                                                        _.trys.pop();
                                                        continue;
                                        }
                                        op = body.call(thisArg, _);
                                } catch (e) {
                                        op = [6, e];
                                        y = 0;
                                } finally {
                                        f = t = 0;
                                }
                        if (op[0] & 5) throw op[1];
                        return { value: op[0] ? op[1] : void 0, done: true };
                }
        };
Object.defineProperty(exports, '__esModule', { value: true });
// import { applicationDefault, initializeApp } from 'firebase-admin/app';
var routes_config_1 = require('./notice/routes.config');
var routes_config_2 = require('./users/routes.config');
var mongoose_service_1 = require('./services/mongoose.service');
var auth_config_1 = require('./services/auth/auth.config');
var routes_config_3 = require('./news/routes.config');
var routes_config_4 = require('./chats/routes.config');
var socketMiddleware = __importStar(require('./services/socket/middleware/socket.middleware'));
var cors = require('cors');
var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes_config_2.userRoute());
app.use('/', auth_config_1.authRoute());
app.use('/', routes_config_3.newsRoute());
app.use('/', routes_config_1.noticeRoute());
app.use('/', routes_config_4.chatsRoute());
app.use(
        cors({
                origin: 'http://localhost:3000',
                // origin: 'https://assistapp.club:4200',
                optionsSuccessStatus: 200,
                credentials: true,
        }),
);
var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
        return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, mongoose_service_1.connectToDatabase(3000)];
                                case 1:
                                        _a.sent();
                                        // initializeApp({
                                        //   credential: applicationDefault(),
                                        //   projectId: 'assist-app-21d72',
                                        // });
                                        console.log('Server running on port ' + 4200 + '.');
                                        return [2 /*return*/];
                        }
                });
        });
});
// var admin = require("firebase-admin");
// var serviceAccount = require("path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
var io = require('socket.io')(server);
io.on('connection', function (socket) {
        socketMiddleware.userInitCocket(socket);
        socketMiddleware.messagingSocket(socket, 'message', io);
        socketMiddleware.latestMessageSocket(socket);
        socketMiddleware.typpingUserSocket(socket, io);
        socket.on('online', function (id) {
                return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                                console.log(id);
                                socket.emit('online', id);
                                return [2 /*return*/];
                        });
                });
        });
        socket.on('notyping', function () {
                return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                                io.emit('typing', '');
                                return [2 /*return*/];
                        });
                });
        });
});
// app.listen((process.env.PORT || 3000), async () => {
//   // eslint-disable-next-line no-console
// console.log(`Application started on URL ${3000} 🎉`);
//   socket.on('connection', async (client) => {
//     console.log('client connected...');
//     client.on('message', async (msg: any) => {
//       // const message = await createMessage(msg);
//       const message = msg;
//       socket.emit('message', message);
//     });
//     client.on('chat_id', async (id: string) => {
//       const last = await lattestMessage(id);
//       socket.emit('latest', last);
//     });
//     // client.on('latest', async () => {
//     //   const latest = await lattestMesage(10);
//     //   socket.emit('latest', latest);
//     // });
//     // client.on('user writing', async () => {
//     //   socket.emit('typping');
//     // });
//   });
//   socket.on('disconnected', async (client) => {
//     client.emit('broadcast', '[Server]: Bye, bye!');
//   });
//   // server.listen(8999, () => {
//   //   console.log(`Server started on port ${server.address()?.toString()} :) 8999`);
//   // });
// });
