'use strict';
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
exports.getSocketTyping =
        exports.lattestMessage =
        exports.createMessage =
        exports.getMarkerRead =
        exports.markConversationReadByChatId =
        exports.deleteMessage =
        exports.getConversationByRoomId =
        exports.getDataChatById =
        exports.getChats =
        exports.postMessageChat =
        exports.insertChat =
                void 0;
var user_model_1 = require('../../users/model/user.model');
var chats_model_1 = require('../models/chats.model');
var encryption_1 = require('../../services/crypto/encryption');
var decryption_1 = require('../../services/crypto/decryption');
var createChat = function (data) {
        return __awaiter(void 0, void 0, void 0, function () {
                var chat;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, chats_model_1.Chat.create(data)];
                                case 1:
                                        chat = _a.sent();
                                        return [2 /*return*/, chat];
                        }
                });
        });
};
var markMessageRead = function (chat_id, user) {
        return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                        // eslint-disable-next-line no-useless-catch
                        try {
                                return [
                                        2 /*return*/,
                                        chats_model_1.Message.updateMany(
                                                {
                                                        chat_id: chat_id,
                                                        'readByRecipients.readByUserId': { $ne: user },
                                                },
                                                {
                                                        $addToSet: {
                                                                readByRecipients: { readByUserId: user },
                                                        },
                                                },
                                                {
                                                        multi: true,
                                                },
                                        ),
                                ];
                        } catch (error) {
                                throw error;
                        }
                        return [2 /*return*/];
                });
        });
};
var markConversationReadByChatId = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, userId, chat, result, error_1;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        id = req.params.id;
                                        userId = req.body.jwt.userId;
                                        return [4 /*yield*/, chats_model_1.Chat.findById(id)];
                                case 1:
                                        chat = _a.sent();
                                        if (!chat) {
                                                return [
                                                        2 /*return*/,
                                                        res.status(400).json({
                                                                success: false,
                                                                message: 'No chat exists for this id',
                                                        }),
                                                ];
                                        }
                                        return [4 /*yield*/, markMessageRead(id, userId)];
                                case 2:
                                        result = _a.sent();
                                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                                case 3:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, res.status(500).json({ success: false, error: error_1 })];
                                case 4:
                                        return [2 /*return*/];
                        }
                });
        });
};
exports.markConversationReadByChatId = markConversationReadByChatId;
var getDataChatById = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, jwt, chat, last_1, favoriteUser, user, user_id, currentUser, costumer, last, newDataChat_1, newDataChat;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        jwt = req.body.jwt;
                                        return [4 /*yield*/, chats_model_1.Chat.findById({ _id: id })];
                                case 1:
                                        chat = _a.sent();
                                        if (!chat) {
                                                return [2 /*return*/, res.status(404).json({ message: 'Chat not found' })];
                                        }
                                        if (jwt.userId !== chat.users[0] && jwt.userId !== chat.users[1]) {
                                                return [2 /*return*/, res.status(404).json({ message: 'Chat not found' })];
                                        }
                                        if (chat.users[0] === jwt.userId && chat.users[1] === jwt.userId) {
                                                last_1 = decryption_1.decrypt(chat.latestMessage[0], id);
                                                favoriteUser = {
                                                        user: {
                                                                fullName: 'Favorite messages',
                                                        },
                                                        latestMessage: last_1,
                                                        favorite: true,
                                                        id: id,
                                                        chat: chat,
                                                };
                                                return [2 /*return*/, res.status(200).json({ data: favoriteUser })];
                                        }
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: jwt.userId })];
                                case 2:
                                        user = _a.sent();
                                        user_id = user === null || user === void 0 ? void 0 : user._id.toString();
                                        currentUser = chat.users
                                                .filter(function (u) {
                                                        return u !== user_id;
                                                })
                                                .toString();
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: currentUser })];
                                case 3:
                                        costumer = _a.sent();
                                        last = decryption_1.decrypt(chat.latestMessage[0], id);
                                        if (last) {
                                                newDataChat_1 = {
                                                        user: {
                                                                fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
                                                                image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
                                                        },
                                                        latestMessage: last,
                                                        chat: chat,
                                                };
                                                return [2 /*return*/, res.status(200).send({ data: newDataChat_1 })];
                                        }
                                        newDataChat = {
                                                user: {
                                                        fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
                                                        image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
                                                },
                                                chat: chat,
                                        };
                                        return [2 /*return*/, res.status(200).send({ data: newDataChat })];
                        }
                });
        });
};
exports.getDataChatById = getDataChatById;
var getChats = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var jwt, user, user_id, data, chat_messages, i, element, item;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        jwt = req.body.jwt;
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: jwt.userId }).exec()];
                                case 1:
                                        user = _a.sent();
                                        user_id = user === null || user === void 0 ? void 0 : user._id.toString();
                                        return [4 /*yield*/, chats_model_1.Chat.find({ users: user_id })];
                                case 2:
                                        data = _a.sent();
                                        chat_messages = data;
                                        for (i = 0; i < chat_messages.length; i++) {
                                                element = chat_messages[i].latestMessage[0];
                                                item = decryption_1.decrypt(element, chat_messages[i]._id);
                                                data[i].latestMessage = item;
                                        }
                                        res.status(200).json({ data: data });
                                        return [2 /*return*/];
                        }
                });
        });
};
exports.getChats = getChats;
var getMarkerRead = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, conversation;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        return [
                                                4 /*yield*/,
                                                chats_model_1.Message.aggregate([
                                                        { $match: { chat_id: id } },
                                                        { $sort: { createdAt: -1 } },
                                                        { $unwind: '$readByRecipients' },
                                                        {
                                                                $group: {
                                                                        _id: '$chat_id',
                                                                        chat_id: { $last: '$chat_id' },
                                                                        message: { $last: '$message' },
                                                                        readByRecipients: { $addToSet: '$readByRecipients' },
                                                                        createdAt: { $last: '$createdAt' },
                                                                },
                                                        },
                                                ]),
                                        ];
                                case 1:
                                        conversation = _a.sent();
                                        return [
                                                2 /*return*/,
                                                res.status(200).json({
                                                        conversation: conversation,
                                                }),
                                        ];
                        }
                });
        });
};
exports.getMarkerRead = getMarkerRead;
var getConversationByRoomId = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, jwt, chat, conversation, chat_messages, i, element, item;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        jwt = req.body.jwt;
                                        return [4 /*yield*/, chats_model_1.Chat.findById({ _id: id })];
                                case 1:
                                        chat = _a.sent();
                                        if (!chat) {
                                                return [
                                                        2 /*return*/,
                                                        res.status(400).json({
                                                                message: 'No chat exists for this id',
                                                        }),
                                                ];
                                        }
                                        if (jwt.userId !== chat.users[0] && jwt.userId !== chat.users[1]) {
                                                return [2 /*return*/, res.status(404).json({ message: 'Chat not found' })];
                                        }
                                        return [
                                                4 /*yield*/,
                                                chats_model_1.Message.aggregate([
                                                        { $match: { chat_id: id } },
                                                        { $sort: { createdAt: 1 } },
                                                        { $unwind: '$user_id' },
                                                ]),
                                        ];
                                case 2:
                                        conversation = _a.sent();
                                        chat_messages = conversation;
                                        for (i = 0; i < chat_messages.length; i++) {
                                                element = chat_messages[i].message[0];
                                                item = decryption_1.decrypt(element, id);
                                                conversation[i].message = item;
                                        }
                                        return [
                                                2 /*return*/,
                                                res.status(200).json({
                                                        conversation: conversation,
                                                }),
                                        ];
                        }
                });
        });
};
exports.getConversationByRoomId = getConversationByRoomId;
var createMessage = function (data) {
        return __awaiter(void 0, void 0, void 0, function () {
                var hash, mes, mess_id, dec_message, last_user, crntChat, recievedMessage;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        hash = encryption_1.encrypt(data.message, data.chat_id);
                                        data.message = hash;
                                        return [4 /*yield*/, chats_model_1.Message.create(data)];
                                case 1:
                                        mes = _a.sent();
                                        mess_id = mes === null || mes === void 0 ? void 0 : mes._id;
                                        dec_message = decryption_1.decrypt(data.message, data.chat_id);
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: mes.user_id })];
                                case 2:
                                        last_user = _a.sent();
                                        return [4 /*yield*/, chats_model_1.Chat.findById({ _id: data.chat_id })];
                                case 3:
                                        crntChat = _a.sent();
                                        markMessageRead(data.chat_id, mes.user_id);
                                        return [
                                                4 /*yield*/,
                                                chats_model_1.Chat.replaceOne(
                                                        { _id: data.chat_id },
                                                        {
                                                                latestMessage: mes.message,
                                                                users: crntChat === null || crntChat === void 0 ? void 0 : crntChat.users,
                                                                last_user: last_user === null || last_user === void 0 ? void 0 : last_user.fullName,
                                                                updatedAt: new Date(),
                                                        },
                                                ),
                                        ];
                                case 4:
                                        _a.sent();
                                        recievedMessage = {
                                                message: dec_message,
                                                chat_id: mes.chat_id,
                                                user_id: mes.user_id,
                                                createdAt: mes.createdAt,
                                                _id: mess_id,
                                                readByRecipients: { readByUserId: mes.user_id },
                                        };
                                        return [2 /*return*/, recievedMessage];
                        }
                });
        });
};
exports.createMessage = createMessage;
var lattestMessage = function (id) {
        return __awaiter(void 0, void 0, void 0, function () {
                var conversation, chat_messages, i, element, item;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, chats_model_1.Message.find({ chat_id: id }).sort({ createdAt: 1 })];
                                case 1:
                                        conversation = _a.sent();
                                        chat_messages = conversation;
                                        for (i = 0; i < chat_messages.length; i++) {
                                                element = chat_messages[i].message[0];
                                                item = decryption_1.decrypt(element, id);
                                                conversation[i].message = item;
                                        }
                                        return [2 /*return*/, conversation];
                        }
                });
        });
};
exports.lattestMessage = lattestMessage;
var insertChat = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var data, userId, currentUser, costumer;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        data = req.body.data;
                                        userId = req.body.jwt.userId;
                                        if (!data) {
                                                return [2 /*return*/, res.status(401).json({ message: 'Need data', code: 401 })];
                                        }
                                        if (!data.costumer) {
                                                return [2 /*return*/, res.status(401).json({ message: 'Need costumer', code: 401 })];
                                        }
                                        if (!data.initiator) {
                                                return [2 /*return*/, res.status(401).json({ message: 'Need initiator', code: 401 })];
                                        }
                                        if (data.costumer === data.initiator) {
                                                data.favorite = true;
                                                data.user = {
                                                        fullName: 'Favorite messages',
                                                };
                                        }
                                        data.users = [data.costumer, data.initiator];
                                        currentUser = data.users
                                                .filter(function (u) {
                                                        return u !== userId;
                                                })
                                                .toString();
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: currentUser })];
                                case 1:
                                        costumer = _a.sent();
                                        data.user = {
                                                fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
                                                image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
                                        };
                                        return [
                                                2 /*return*/,
                                                createChat(data).then(function (createdChat) {
                                                        res.status(200).send({ id: createdChat.id });
                                                }),
                                        ];
                        }
                });
        });
};
exports.insertChat = insertChat;
var postMessageChat = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var _a, data, jwt, id, message_data;
                return __generator(this, function (_b) {
                        (_a = req.body), (data = _a.data), (jwt = _a.jwt);
                        id = req.params.id;
                        message_data = {
                                message: data.message,
                                user_id: jwt.userId,
                                chat_id: id,
                                createdAt: new Date(),
                                readByRecipients: { readByUserId: jwt.userId },
                        };
                        return [
                                2 /*return*/,
                                createMessage(message_data).then(function (createMess) {
                                        return __awaiter(void 0, void 0, void 0, function () {
                                                var currentChat, lastUser;
                                                return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                                case 0:
                                                                        return [4 /*yield*/, chats_model_1.Chat.findById({ _id: id })];
                                                                case 1:
                                                                        currentChat = _a.sent();
                                                                        return [4 /*yield*/, user_model_1.User.findById({ _id: jwt.userId })];
                                                                case 2:
                                                                        lastUser = _a.sent();
                                                                        // eslint-disable-next-line no-underscore-dangle
                                                                        return [
                                                                                4 /*yield*/,
                                                                                chats_model_1.Chat.replaceOne(
                                                                                        {
                                                                                                _id:
                                                                                                        currentChat === null || currentChat === void 0
                                                                                                                ? void 0
                                                                                                                : currentChat._id,
                                                                                        },
                                                                                        {
                                                                                                latestMessage: createMess,
                                                                                                last_user:
                                                                                                        lastUser === null || lastUser === void 0
                                                                                                                ? void 0
                                                                                                                : lastUser.fullName,
                                                                                                users:
                                                                                                        currentChat === null || currentChat === void 0
                                                                                                                ? void 0
                                                                                                                : currentChat.users,
                                                                                                updatedAt: new Date(),
                                                                                        },
                                                                                ),
                                                                        ];
                                                                case 3:
                                                                        // eslint-disable-next-line no-underscore-dangle
                                                                        _a.sent();
                                                                        res.status(200).send({ data: createMess });
                                                                        return [2 /*return*/];
                                                        }
                                                });
                                        });
                                }),
                        ];
                });
        });
};
exports.postMessageChat = postMessageChat;
var getSocketTyping = function (user_id) {
        return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: user_id })];
                                case 1:
                                        user = _a.sent();
                                        return [2 /*return*/, user];
                        }
                });
        });
};
exports.getSocketTyping = getSocketTyping;
var deleteMessage = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, message;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        return [4 /*yield*/, chats_model_1.Message.deleteOne({ _id: id })];
                                case 1:
                                        message = _a.sent();
                                        return [2 /*return*/, res.status(200).json({ message: message })];
                        }
                });
        });
};
exports.deleteMessage = deleteMessage;
