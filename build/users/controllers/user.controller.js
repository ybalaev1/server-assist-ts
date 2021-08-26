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
exports.findByEmail = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.createUser = void 0;
var user_model_1 = require("../model/user.model");
var crypto = require('crypto');
var hashPassword = function (password) {
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
    return hash;
};
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, posts, information, following, followers, fullName, email, password, mobile_phone, interest, userInput, userCreated;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, posts = _a.posts, information = _a.information, following = _a.following, followers = _a.followers, fullName = _a.fullName, email = _a.email, password = _a.password, mobile_phone = _a.mobile_phone, interest = _a.interest;
                if (!email || !fullName || !password) {
                    return [2 /*return*/, res.status(422).json({ message: 'The fields email, fullName and password are required' })];
                }
                userInput = {
                    fullName: fullName,
                    email: email,
                    password: hashPassword(password),
                    mobile_phone: mobile_phone,
                    interest: interest,
                    followers: followers,
                    following: following,
                    information: information,
                    posts: posts,
                };
                return [4 /*yield*/, user_model_1.User.create(userInput)];
            case 1:
                userCreated = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: userCreated })];
        }
    });
}); };
exports.createUser = createUser;
var getAllUsers = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.User.find().exec()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.status(200).json({ data: users })];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, user_model_1.User.findOne({ _id: id })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User with id " + id + " not found" })];
                }
                return [2 /*return*/, res.status(200).json({ data: user })];
        }
    });
}); };
exports.getUserById = getUserById;
var findByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                user_model_1.User.findOne({ email: email }).exec(function (err, id) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(id);
                    }
                });
            })];
    });
}); };
exports.findByEmail = findByEmail;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, posts, information, following, followers, fullName, email, password, mobile_phone, interest, user, userUpdated;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, posts = _a.posts, information = _a.information, following = _a.following, followers = _a.followers, fullName = _a.fullName, email = _a.email, password = _a.password, mobile_phone = _a.mobile_phone, interest = _a.interest;
                user = user_model_1.User.findById(id);
                if (!user) {
                    return [2 /*return*/, res.status(422).json({ message: "User with id " + id + " not found" })];
                }
                if (!fullName) {
                    return [2 /*return*/, res.status(422).json({ message: 'The fields fullName are required' })];
                }
                return [4 /*yield*/, user_model_1.User.updateOne({ _id: id }, {
                        posts: posts,
                        information: information,
                        following: following,
                        followers: followers,
                        fullName: fullName,
                        email: email,
                        password: password,
                        mobile_phone: mobile_phone,
                        interest: interest,
                    })];
            case 1:
                _b.sent();
                return [4 /*yield*/, user_model_1.User.findById(id)];
            case 2:
                userUpdated = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: userUpdated })];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, user_model_1.User.findByIdAndDelete(id)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'User deleted successfully.' })];
        }
    });
}); };
exports.deleteUser = deleteUser;
