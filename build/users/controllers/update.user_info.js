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
Object.defineProperty(exports, '__esModule', { value: true });
exports.removeFollowId = exports.setFollowId = void 0;
var user_model_1 = require('../model/user.model');
var getFollowers = function (id) {
        return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: id })];
                                case 1:
                                        user = _a.sent();
                                        if (user) {
                                                return [2 /*return*/, user.followers];
                                        }
                                        return [2 /*return*/, user];
                        }
                });
        });
};
var setFollowId = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id_follow, id;
                return __generator(this, function (_a) {
                        id_follow = req.body.id_follow;
                        id = req.params.id;
                        getFollowers(id).then(function (result) {
                                return __awaiter(void 0, void 0, void 0, function () {
                                        var even, updateUser, id_user;
                                        return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                        case 0:
                                                                even = function (el) {
                                                                        return el.id === id_follow;
                                                                };
                                                                if (result.some(even)) {
                                                                        return [
                                                                                2 /*return*/,
                                                                                res.status(403).json({ message: 'User already exists', code: 403 }),
                                                                        ];
                                                                }
                                                                return [
                                                                        4 /*yield*/,
                                                                        user_model_1.User.updateOne(
                                                                                { _id: id },
                                                                                { $push: { followers: { id: id_follow } } },
                                                                        ),
                                                                ];
                                                        case 1:
                                                                _a.sent();
                                                                return [4 /*yield*/, user_model_1.User.findById(id)];
                                                        case 2:
                                                                updateUser = _a.sent();
                                                                id_user = id;
                                                                return [
                                                                        4 /*yield*/,
                                                                        user_model_1.User.updateOne(
                                                                                { _id: id_follow },
                                                                                { $push: { following: { id: id_user } } },
                                                                        ),
                                                                ];
                                                        case 3:
                                                                _a.sent();
                                                                return [2 /*return*/, res.status(200).json({ data: updateUser })];
                                                }
                                        });
                                });
                        });
                        return [2 /*return*/];
                });
        });
};
exports.setFollowId = setFollowId;
var removeFollowId = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var id_follow, id, updateUser, id_user, error_1;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id_follow = req.body.id_follow;
                                        id = req.params.id;
                                        return [4 /*yield*/, user_model_1.User.updateOne({ _id: id }, { $pull: { followers: { id: id_follow } } })];
                                case 1:
                                        _a.sent();
                                        return [4 /*yield*/, user_model_1.User.findById(id)];
                                case 2:
                                        updateUser = _a.sent();
                                        _a.label = 3;
                                case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        id_user = id;
                                        return [
                                                4 /*yield*/,
                                                user_model_1.User.updateOne({ _id: id_follow }, { $pull: { following: { id: id_user } } }),
                                        ];
                                case 4:
                                        _a.sent();
                                        return [2 /*return*/, res.status(200).json({ data: updateUser })];
                                case 5:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, res.status(403).json({ error: error_1 })];
                                case 6:
                                        return [2 /*return*/];
                        }
                });
        });
};
exports.removeFollowId = removeFollowId;
