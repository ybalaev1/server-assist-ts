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
exports.authValidFields = exports.matchUserAndPassword = void 0;
var user_controller_1 = require("../../../users/controllers/user.controller");
var crypto = require('crypto');
var authValidFields = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data_auth;
    return __generator(this, function (_a) {
        data_auth = req.body.data_auth;
        if (data_auth) {
            if (!data_auth.email) {
                return [2, res.status(422).json({ message: 'The fields email are required' })];
            }
            if (!data_auth.password) {
                return [2, res.status(422).json({ message: 'The fields password are required' })];
            }
        }
        else {
            return [2, res.status(400).json({ message: 'Missing email and password' })];
        }
        return [2, next()];
    });
}); };
exports.authValidFields = authValidFields;
var matchUserAndPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data_auth;
    return __generator(this, function (_a) {
        data_auth = req.body.data_auth;
        console.log('matchUserAndPassword', req.body);
        (0, user_controller_1.findByEmail)(data_auth.email).then(function (user) {
            if (!user[0]) {
                res.status(404).send({ message: 'User not found' });
            }
            else {
                var passField = user[0].password.split('$');
                var salt = passField[0];
                var hash = crypto.createHmac('sha512', salt).update(data_auth.password).digest('base64');
                if (hash === passField[1]) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        provider: 'email',
                        name: user[0].fullName,
                    };
                    return next();
                }
                return res.status(400).send({ message: 'Invalid e-mail or password' });
            }
            return next();
        });
        return [2];
    });
}); };
exports.matchUserAndPassword = matchUserAndPassword;
