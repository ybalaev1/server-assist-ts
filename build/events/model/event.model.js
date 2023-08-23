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
exports.Event = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const eventShema = new mongoose_1.Schema({
    title: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    description: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    attendedPeople: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    categories: {
        type: mongoose_1.Schema.Types.Array,
        required: true,
    },
    images: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
    communityUid: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    creator: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    eventDate: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    eventUid: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    location: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    place: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    typeEvent: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    id: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    price: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    userImages: {
        type: mongoose_1.Schema.Types.Array,
        required: false,
    },
}, {
    collection: 'events',
});
const Event = mongoose_1.default.model('Event', eventShema);
exports.Event = Event;
