'use strict';
var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
                function adopt(value) {
                        return value instanceof P
                                ? value
                                : new P(function (resolve) {
                                          resolve(value);
                                  });
                }
                return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) {
                                try {
                                        step(generator.next(value));
                                } catch (e) {
                                        reject(e);
                                }
                        }
                        function rejected(value) {
                                try {
                                        step(generator['throw'](value));
                                } catch (e) {
                                        reject(e);
                                }
                        }
                        function step(result) {
                                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                        }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
        };
var __generator =
        (this && this.__generator) ||
        function (thisArg, body) {
                var _ = {
                                label: 0,
                                sent: function () {
                                        if (t[0] & 1) throw t[1];
                                        return t[1];
                                },
                                trys: [],
                                ops: [],
                        },
                        f,
                        y,
                        t,
                        g;
                return (
                        (g = { next: verb(0), throw: verb(1), return: verb(2) }),
                        typeof Symbol === 'function' &&
                                (g[Symbol.iterator] = function () {
                                        return this;
                                }),
                        g
                );
                function verb(n) {
                        return function (v) {
                                return step([n, v]);
                        };
                }
                function step(op) {
                        if (f) throw new TypeError('Generator is already executing.');
                        while (_)
                                try {
                                        if (
                                                ((f = 1),
                                                y &&
                                                        (t =
                                                                op[0] & 2
                                                                        ? y['return']
                                                                        : op[0]
                                                                        ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                                                                        : y.next) &&
                                                        !(t = t.call(y, op[1])).done)
                                        )
                                                return t;
                                        if (((y = 0), t)) op = [op[0] & 2, t.value];
                                        switch (op[0]) {
                                                case 0:
                                                case 1:
                                                        t = op;
                                                        break;
                                                case 4:
                                                        _.label++;
                                                        return { value: op[1], done: false };
                                                case 5:
                                                        _.label++;
                                                        y = op[1];
                                                        op = [0];
                                                        continue;
                                                case 7:
                                                        op = _.ops.pop();
                                                        _.trys.pop();
                                                        continue;
                                                default:
                                                        if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                                                                _ = 0;
                                                                continue;
                                                        }
                                                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                                                _.label = op[1];
                                                                break;
                                                        }
                                                        if (op[0] === 6 && _.label < t[1]) {
                                                                _.label = t[1];
                                                                t = op;
                                                                break;
                                                        }
                                                        if (t && _.label < t[2]) {
                                                                _.label = t[2];
                                                                _.ops.push(op);
                                                                break;
                                                        }
                                                        if (t[2]) _.ops.pop();
                                                        _.trys.pop();
                                                        continue;
                                        }
                                        op = body.call(thisArg, _);
                                } catch (e) {
                                        op = [6, e];
                                        y = 0;
                                } finally {
                                        f = t = 0;
                                }
                        if (op[0] & 5) throw op[1];
                        return { value: op[0] ? op[1] : void 0, done: true };
                }
        };
var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
                return mod && mod.__esModule ? mod : { default: mod };
        };
Object.defineProperty(exports, '__esModule', { value: true });
exports.findByEmail = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.insertUser = void 0;
var crypto_1 = __importDefault(require('crypto'));
var user_model_1 = require('../model/user.model');
var createUser = function (userData) {
        return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, user_model_1.User.create(userData)];
                                case 1:
                                        user = _a.sent();
                                        return [2 /*return*/, user];
                        }
                });
        });
};
var findByEmail = function (value) {
        return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                        return [
                                2 /*return*/,
                                new Promise(function (resolve, reject) {
                                        user_model_1.User.find({ email: value }).exec(function (err, id) {
                                                if (err) {
                                                        reject(err);
                                                } else {
                                                        resolve(id);
                                                }
                                        });
                                }),
                        ];
                });
        });
};
exports.findByEmail = findByEmail;
var insertUser = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var password, data, salt, hash;
                return __generator(this, function (_a) {
                        password = req.body.data.password;
                        data = req.body.data;
                        salt = crypto_1.default.randomBytes(16).toString('base64');
                        if (password) {
                                hash = crypto_1.default.createHmac('sha512', salt).update(password).digest('base64');
                                data.password = salt + '$' + hash;
                                if (data.email) {
                                        findByEmail(data.email).then(function (result) {
                                                if (!result[0]) {
                                                        if (!data.fullName) {
                                                                res.status(400).send({ message: 'Field fullName is required.', code: 400 });
                                                        } else {
                                                                return createUser(data).then(function (createdUser) {
                                                                        // eslint-disable-next-line no-underscore-dangle
                                                                        res.status(200).json({ id: createdUser._id });
                                                                });
                                                        }
                                                } else {
                                                        res.status(418).json({ message: 'User already exists', code: 418 });
                                                }
                                                return result;
                                        });
                                } else {
                                        res.status(400).send({ message: 'Field email is required.', code: 400 });
                                }
                        } else {
                                res.status(400).send({ message: 'Field password is required.', code: 400 });
                        }
                        return [2 /*return*/];
                });
        });
};
exports.insertUser = insertUser;
var getAllUsers = function (_req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var users;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, user_model_1.User.find().exec()];
                                case 1:
                                        users = _a.sent();
                                        return [2 /*return*/, res.status(200).json({ data: users })];
                        }
                });
        });
};
exports.getAllUsers = getAllUsers;
var getUserById = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, user;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        return [4 /*yield*/, user_model_1.User.findOne({ _id: id })];
                                case 1:
                                        user = _a.sent();
                                        if (!user) {
                                                return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                                        }
                                        return [2 /*return*/, res.status(200).json({ data: user })];
                        }
                });
        });
};
exports.getUserById = getUserById;
var updateUser = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id, email, userUpdated, error_1;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        email = req.body.email;
                                        _a.label = 1;
                                case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        findByEmail(email).then(function (result) {
                                                return __awaiter(void 0, void 0, void 0, function () {
                                                        var userUpdated_1;
                                                        return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                        case 0:
                                                                                if (!!result[0]) return [3 /*break*/, 3];
                                                                                return [
                                                                                        4 /*yield*/,
                                                                                        user_model_1.User.updateOne({ _id: id }, req.body),
                                                                                ];
                                                                        case 1:
                                                                                _a.sent();
                                                                                return [4 /*yield*/, user_model_1.User.findById(id)];
                                                                        case 2:
                                                                                userUpdated_1 = _a.sent();
                                                                                return [2 /*return*/, res.status(200).send({ data: userUpdated_1 })];
                                                                        case 3:
                                                                                return [
                                                                                        2 /*return*/,
                                                                                        res.status(403).json({
                                                                                                message: 'User with this email already exists',
                                                                                                code: 403,
                                                                                        }),
                                                                                ];
                                                                }
                                                        });
                                                });
                                        });
                                        return [4 /*yield*/, user_model_1.User.updateOne({ _id: id }, req.body)];
                                case 2:
                                        _a.sent();
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: id })];
                                case 3:
                                        userUpdated = _a.sent();
                                        return [2 /*return*/, res.status(200).send({ data: userUpdated })];
                                case 4:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, res.status(404).json({ message: 'User not found', code: 404 })];
                                case 5:
                                        return [2 /*return*/];
                        }
                });
        });
};
exports.updateUser = updateUser;
var deleteUser = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
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
        });
};
exports.deleteUser = deleteUser;
