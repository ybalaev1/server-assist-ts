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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userShema = new mongoose_1.Schema({
    userName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    userGender: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    userCountry: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    userRole: {
        type: mongoose_1.Schema.Types.Array,
        required: true,
    },
    userImage: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    individualStyles: {
        type: mongoose_1.Schema.Types.Array,
        required: true,
    },
    myCommunities: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    joinedCommunities: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    events: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    goingEvent: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    paidEvents: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    id: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    customer: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
}, {
    collection: 'users',
    timestamps: true,
});
const User = mongoose_1.default.model('User', userShema);
exports.User = User;
