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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getConversationByRoomId = exports.getChatById = exports.getChats = exports.postMessageChat = exports.insertChat = void 0;
var user_model_1 = require("../../users/model/user.model");
var chats_model_1 = require("../models/chats.model");
var getChats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, user_id, currentChat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.User.findById({ _id: req.query.id }).exec()];
            case 1:
                user = _a.sent();
                user_id = user === null || user === void 0 ? void 0 : user._id.toString();
                return [4 /*yield*/, chats_model_1.Chat.find({ users: { $in: user_id } })];
            case 2:
                currentChat = _a.sent();
                return [2 /*return*/, res.status(200).json({ data: currentChat })];
        }
    });
}); };
exports.getChats = getChats;
var getChatById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, chat, favoriteUser, user, user_id, currentUser, costumer, newDataChat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, chats_model_1.Chat.findById({ _id: id })];
            case 1:
                chat = _a.sent();
                if (!chat) {
                    return [2 /*return*/, res.status(404).json({ message: 'Chat not found' })];
                }
                if (chat.users[0] === req.query.user && chat.users[1] === req.query.user) {
                    favoriteUser = {
                        user: {
                            fullName: 'Favorite messages',
                            image: 'favor',
                        },
                        id: id,
                        chat: chat,
                        last_user: chat === null || chat === void 0 ? void 0 : chat.last_user,
                    };
                    return [2 /*return*/, res.status(200).json({ data: favoriteUser })];
                }
                return [4 /*yield*/, user_model_1.User.findById({ _id: req.query.user })];
            case 2:
                user = _a.sent();
                user_id = user === null || user === void 0 ? void 0 : user._id.toString();
                currentUser = chat.users.filter(function (u) { return u !== user_id; }).toString();
                return [4 /*yield*/, user_model_1.User.findById({ _id: currentUser })];
            case 3:
                costumer = _a.sent();
                newDataChat = {
                    user: {
                        fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
                        image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
                    },
                    id: id,
                    chat: chat,
                    last_user: chat === null || chat === void 0 ? void 0 : chat.last_user,
                };
                return [2 /*return*/, res.status(200).json({ data: newDataChat })];
        }
    });
}); };
exports.getChatById = getChatById;
var getConversationByRoomId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, chat, conversation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, chats_model_1.Chat.findById({ _id: id })];
            case 1:
                chat = _a.sent();
                if (!chat) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'No chat exists for this id',
                        })];
                }
                return [4 /*yield*/, chats_model_1.Message.aggregate([
                        { $match: { chat_id: id } },
                        { $sort: { createdAt: 1 } },
                        { $unwind: '$user_id' },
                        // { $sort: { createdAt: 1 } },
                        // { $skip: 14 },
                        // { $limit: 10 },
                    ])];
            case 2:
                conversation = _a.sent();
                // console.log(conversation, chat.users);
                return [2 /*return*/, res.status(200).json({
                        conversation: conversation,
                    })];
        }
    });
}); };
exports.getConversationByRoomId = getConversationByRoomId;
var createChat = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var chat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, chats_model_1.Chat.create(data)];
            case 1:
                chat = _a.sent();
                return [2 /*return*/, chat];
        }
    });
}); };
var createMessage = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, chats_model_1.Message.create(data)];
            case 1:
                message = _a.sent();
                return [2 /*return*/, message];
        }
    });
}); };
var insertChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = req.body.data;
        data.users = [data.costumer, data.initiator];
        return [2 /*return*/, createChat(data).then(function (createdChat) {
                res.status(200).send({ id: createdChat.id });
            })];
    });
}); };
exports.insertChat = insertChat;
var postMessageChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = req.body.data;
        return [2 /*return*/, createMessage(data).then(function (createMess) { return __awaiter(void 0, void 0, void 0, function () {
                var currentChat, lastUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chats_model_1.Chat.findById({ _id: createMess.chat_id })];
                        case 1:
                            currentChat = _a.sent();
                            return [4 /*yield*/, user_model_1.User.findById({ _id: createMess.user_id })];
                        case 2:
                            lastUser = _a.sent();
                            return [4 /*yield*/, chats_model_1.Chat.replaceOne({ _id: currentChat === null || currentChat === void 0 ? void 0 : currentChat._id }, {
                                    latestMessage: createMess.message,
                                    last_user: lastUser === null || lastUser === void 0 ? void 0 : lastUser.fullName,
                                    users: currentChat === null || currentChat === void 0 ? void 0 : currentChat.users,
                                })];
                        case 3:
                            _a.sent();
                            res.status(200).send({ data: createMess });
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.postMessageChat = postMessageChat;
var deleteMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
}); };
exports.deleteMessage = deleteMessage;
