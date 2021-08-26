"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userShema = new mongoose_1.Schema({
    fullName: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    information: {
        type: mongoose_1.Schema.Types.String,
        required: false
    },
    interest: {
        type: mongoose_1.Schema.Types.Array,
        required: false
    },
    mobile_phone: {
        type: mongoose_1.Schema.Types.Number,
        required: false
    },
    followers: {
        type: mongoose_1.Schema.Types.Array,
        required: false
    },
    following: {
        type: mongoose_1.Schema.Types.Array,
        required: false
    },
    posts: {
        type: mongoose_1.Schema.Types.Array,
        required: false
    },
}, {
    collection: 'users',
    timestamps: true
});
const User = mongoose_1.default.model('User', userShema);
exports.User = User;
//# sourceMappingURL=user.model.js.map