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
exports.createNoticeForUserId = exports.getNotifications = void 0;
var decryption_1 = require("../../services/crypto/decryption");
var user_model_1 = require("../../users/model/user.model");
var chats_model_1 = require("../../chats/models/chats.model");
var notice_model_1 = require("../model/notice.model");
var getNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, notice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = req.body.jwt;
                return [4, notice_model_1.Notice.find({ user: jwt.userId })];
            case 1:
                notice = _a.sent();
                res.status(200).json({ notice: notice });
                return [2];
        }
    });
}); };
exports.getNotifications = getNotifications;
var createNoticeForUserId = function (data, user_id, type, socket) { return __awaiter(void 0, void 0, void 0, function () {
    var chat, reciever_user, sender_user, message, notice, new_notice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, chats_model_1.Chat.findById({ _id: data.chat_id })];
            case 1:
                chat = _a.sent();
                reciever_user = chat === null || chat === void 0 ? void 0 : chat.users.filter(function (u) { return u !== user_id; }).toString();
                return [4, user_model_1.User.findById({ _id: user_id })];
            case 2:
                sender_user = _a.sent();
                message = (0, decryption_1.decrypt)(data.message, chat === null || chat === void 0 ? void 0 : chat._id);
                notice = {
                    message: "" + message,
                    title: "" + (sender_user === null || sender_user === void 0 ? void 0 : sender_user.fullName),
                    user: reciever_user,
                    type: type,
                };
                return [4, notice_model_1.Notice.create(notice)];
            case 3:
                new_notice = _a.sent();
                socket.to(data.chat_id).emit('new_push', new_notice);
                return [2];
        }
    });
}); };
exports.createNoticeForUserId = createNoticeForUserId;
