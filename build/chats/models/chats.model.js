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
exports.Message = exports.Chat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const readByRecipientSchema = new mongoose_1.Schema({
    readByUserId: {
        type: mongoose_1.Schema.Types.String,
        require: true,
    },
    readAt: {
        type: mongoose_1.Schema.Types.Date,
        require: true,
        default: new Date(),
    },
}, {
    timestamps: false,
});
const messageSchema = new mongoose_1.Schema({
    chat_id: {
        type: mongoose_1.Schema.Types.String,
        require: true,
    },
    message: {
        type: mongoose_1.Schema.Types.Array,
        require: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.String,
        require: true,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        require: true,
    },
    readByRecipients: {
        type: readByRecipientSchema,
        require: true,
    },
}, {
    timestamps: true,
    collection: 'messages',
});
const chatSchema = new mongoose_1.Schema({
    users: {
        type: mongoose_1.Schema.Types.Array,
        require: true,
    },
    latestMessage: {
        type: mongoose_1.Schema.Types.Array,
        require: false,
    },
    last_user: {
        type: mongoose_1.Schema.Types.String,
        require: false,
    },
    user: {
        type: mongoose_1.Schema.Types.Array,
        require: true,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        default: new Date(),
        require: true,
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        require: true,
    },
    favorite: {
        type: mongoose_1.Schema.Types.Boolean,
        require: true,
        default: false,
    },
}, {
    timestamps: false,
    collection: 'chats',
});
const Chat = mongoose_1.default.model('Chat', chatSchema);
exports.Chat = Chat;
const Message = mongoose_1.default.model('Message', messageSchema);
exports.Message = Message;
