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
exports.updateUser = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.createUser = void 0;
const crypto = require('crypto');
const user_model_1 = require("../model/user.model");
const hashPassword = (password) => {
    let salt = crypto.randomBytes(16).toString('base64');
    return crypto.pbkdf2Sync(password, salt, 100, 64, `sha512`).toString(`hex`);
};
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { posts, information, following, followers, fullName, email, password, mobile_phone, interest } = req.body;
    if (!email || !fullName || !password) {
        return res.status(422).json({ message: 'The fields email, fullName and password are required' });
    }
    const userInput = {
        fullName,
        email,
        password: hashPassword(password),
        mobile_phone,
        interest,
        followers,
        following,
        information,
        posts
    };
    const userCreated = yield user_model_1.User.create(userInput);
    return res.status(200).json({ data: userCreated });
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find().exec();
    return res.status(200).json({ data: users });
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.User.findById({ _id: id });
    if (!user) {
        return res.status(422).json({ message: `User with id ${id} not found` });
    }
    return res.status(200).json({ data: user });
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { posts, information, following, followers, fullName, email, password, mobile_phone, interest } = req.body;
    const user = user_model_1.User.findById(id);
    if (!user) {
        return res.status(422).json({ message: `User with id ${id} not found` });
    }
    if (!fullName) {
        return res.status(422).json({ message: 'The fields fullName are required' });
    }
    yield user_model_1.User.updateOne({ _id: id }, { posts, information, following, followers, fullName, email, password, mobile_phone, interest });
    const userUpdated = yield user_model_1.User.findById(id);
    return res.status(200).json({ data: userUpdated });
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_model_1.User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted successfully.' });
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map