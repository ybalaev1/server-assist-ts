"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getTickets = exports.onChangeLocation = exports.userExistByEmail = exports.findByEmail = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.insertUser = void 0;
var crypto_1 = __importDefault(require("crypto"));
var user_model_1 = require("../model/user.model");
var index_1 = require("../../index");
var event_model_1 = require("../../events/model/event.model");
var createUser = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, user_model_1.User.create(data)];
            case 1:
                user = _a.sent();
                return [2, user];
        }
    });
}); };
var userExistByEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.params);
                email = req.params.email;
                return [4, user_model_1.User.findOne({ 'email': email }).exec()];
            case 1:
                user = _a.sent();
                return [2, res.send({ user: user })];
        }
    });
}); };
exports.userExistByEmail = userExistByEmail;
var findByEmail = function (value) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                user_model_1.User.find({ email: value }).exec(function (err, id) {
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
var insertUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pass, salt, hash;
    return __generator(this, function (_a) {
        data = req.body.data;
        pass = data.email;
        salt = crypto_1.default.randomBytes(16).toString('base64');
        if (pass) {
            hash = crypto_1.default.createHmac('sha512', salt).update(pass).digest('base64');
            data.password = salt + "$" + hash;
            if (data.email) {
                return [2, createUser(data).then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, user_model_1.User.updateOne({ _id: user === null || user === void 0 ? void 0 : user._id }, { 'id': user === null || user === void 0 ? void 0 : user._id })];
                                case 1:
                                    _a.sent();
                                    data = __assign(__assign({}, user === null || user === void 0 ? void 0 : user.toJSON()), { id: user === null || user === void 0 ? void 0 : user._id });
                                    return [2, res.status(200).send(__assign({}, data))];
                            }
                        });
                    }); })];
            }
            else {
                res.status(400).send({ message: 'Field email is required.', code: 400 });
            }
        }
        else {
            res.status(400).send({ message: 'Field password is required.', code: 400 });
        }
        return [2];
    });
}); };
exports.insertUser = insertUser;
var getAllUsers = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, user_model_1.User.find().exec()];
            case 1:
                users = _a.sent();
                return [2, res.status(200).json({ data: users })];
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
                return [4, user_model_1.User.findOne({ 'id': id })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2, res.status(404).json({ message: 'User not found' })];
                }
                return [2, res.status(200).json({ data: user })];
        }
    });
}); };
exports.getUserById = getUserById;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, userUpdate, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = req.body.jwt;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, req.body)];
            case 2:
                _a.sent();
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec()];
            case 3:
                userUpdate = _a.sent();
                return [2, res.status(200).send(__assign({}, userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.toJSON()))];
            case 4:
                error_1 = _a.sent();
                return [2, res.status(404).json({ message: 'User not found', code: 404 })];
            case 5: return [2];
        }
    });
}); };
exports.updateUser = updateUser;
var onChangeLocation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jwt, userCountry, userUpdate, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, jwt = _a.jwt, userCountry = _a.userCountry;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { userCountry: userCountry })];
            case 2:
                _b.sent();
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec()];
            case 3:
                userUpdate = _b.sent();
                return [2, res.status(200).send(__assign({}, userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.toJSON()))];
            case 4:
                error_2 = _b.sent();
                return [2, res.status(404).json({ message: 'User not found', code: 404 })];
            case 5: return [2];
        }
    });
}); };
exports.onChangeLocation = onChangeLocation;
var getTickets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, user, tickets, allEvents, _a, _b, _i, index, currentTicket, event_1, item;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                jwt = req.body.jwt;
                return [4, user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec()];
            case 1:
                user = _c.sent();
                tickets = user === null || user === void 0 ? void 0 : user.paidEvents;
                allEvents = [];
                _a = [];
                for (_b in tickets)
                    _a.push(_b);
                _i = 0;
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3, 5];
                index = _a[_i];
                currentTicket = tickets[index];
                return [4, event_model_1.Event.find({ _id: currentTicket.eventUid })];
            case 3:
                event_1 = _c.sent();
                item = {
                    currentTicket: currentTicket,
                    event: event_1,
                };
                allEvents.push(item);
                _c.label = 4;
            case 4:
                _i++;
                return [3, 2];
            case 5:
                if (!tickets) {
                    return [2, res.status(404)];
                }
                return [2, res.status(200).json({ paidEvents: allEvents })];
        }
    });
}); };
exports.getTickets = getTickets;
var getPaymentById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, paymentIntent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, index_1.stripe.paymentIntents.retrieve(id)];
            case 1:
                paymentIntent = _a.sent();
                return [2, res.status(200).json({ paymentDetail: paymentIntent })];
        }
    });
}); };
exports.getPaymentById = getPaymentById;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, user_model_1.User.findByIdAndDelete(id)];
            case 1:
                _a.sent();
                return [2, res.status(200).json({ message: 'User deleted successfully.' })];
        }
    });
}); };
exports.deleteUser = deleteUser;
