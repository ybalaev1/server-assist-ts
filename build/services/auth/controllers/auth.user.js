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
exports.refreshPassword = exports.validJWTNeeded = exports.login = void 0;
var user_controller_1 = require("../../../users/controllers/user.controller");
var user_model_1 = require("../../../users/model/user.model");
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var jwtSecret = 'yUdmI2BvcLZ8g1lh3f9JztLlkL3NA9gQ';
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, body, token;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('user eq.body', req.body);
                email = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data_auth).email;
                return [4, user_model_1.User.findOne({ 'email': email }).exec()];
            case 1:
                user = _b.sent();
                try {
                    if (user) {
                        body = {
                            userId: user === null || user === void 0 ? void 0 : user._id,
                            email: email,
                            provider: 'email',
                        };
                        token = jwt.sign(body, jwtSecret);
                        res.status(200).send({ id: body === null || body === void 0 ? void 0 : body.userId, accessToken: token, user: user === null || user === void 0 ? void 0 : user.toJSON() });
                        next();
                    }
                }
                catch (error) {
                    console.log('error login', error);
                    res.status(404).send({ status: 400, message: 'User don`t exist ' });
                    next();
                }
                return [2];
        }
    });
}); };
exports.login = login;
var validJWTNeeded = function (req, res, next) {
    if (req.headers.authorization) {
        try {
            var auth = req.headers.authorization.split(' ');
            if (auth[0] !== 'Bearer') {
                return res.status(401).json({ message: 'Need auth token', code: 401 });
            }
            req.body.jwt = jwt.verify(auth[1], jwtSecret);
            return next();
        }
        catch (err) {
            res.status(403).json({ message: err });
        }
        return next();
    }
    return res.status(401).json({ message: 'Need auth token', code: 401 });
};
exports.validJWTNeeded = validJWTNeeded;
var refreshPassword = function (req, res) {
    var _a = req.body, email = _a.email, new_pass = _a.new_pass;
    if (email) {
        if (new_pass) {
            (0, user_controller_1.findByEmail)(email).then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                var salt, hash, ref_pass;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!result[0]) return [3, 3];
                            salt = crypto.randomBytes(16).toString('base64');
                            hash = crypto.createHmac('sha512', salt).update(new_pass).digest('base64');
                            req.body.password = salt + '$' + hash;
                            return [4, user_model_1.User.updateOne({ _id: result[0].id }, req.body)];
                        case 1:
                            _a.sent();
                            return [4, user_model_1.User.findById(result[0].id)];
                        case 2:
                            ref_pass = _a.sent();
                            return [2, res.status(200).json({ message: 'New password has been updated', code: 200, data: ref_pass })];
                        case 3: return [2, result];
                    }
                });
            }); });
        }
        else {
            return res.status(400).json({ message: 'The fields new_pass are required', code: 401 });
        }
    }
    else {
        return res.status(400).json({ message: 'The fields email are required', code: 401 });
    }
};
exports.refreshPassword = refreshPassword;
