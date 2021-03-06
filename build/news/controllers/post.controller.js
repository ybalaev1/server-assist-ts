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
exports.getPostsByUserFun = exports.getAllPosts = exports.insertPostData = exports.findById = exports.deletePost = void 0;
var user_model_1 = require('../../users/model/user.model');
var post_model_1 = require('../model/post.model');
var findById = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var postId, post;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        postId = req.params.postId;
                                        return [4 /*yield*/, post_model_1.Post.findOne({ _id: postId })];
                                case 1:
                                        post = _a.sent();
                                        if (!post) {
                                                return [
                                                        2 /*return*/,
                                                        res.status(404).json({ message: 'Post with id ' + postId + ' not found', code: 404 }),
                                                ];
                                        }
                                        return [2 /*return*/, res.status(200).json({ data: post })];
                        }
                });
        });
};
exports.findById = findById;
var getPostByUser = function (id) {
        return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: id })];
                                case 1:
                                        user = _a.sent();
                                        if (user) {
                                                return [2 /*return*/, user.posts];
                                        }
                                        return [2 /*return*/, user];
                        }
                });
        });
};
var getAllPosts = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var allPosts, posts, i, item, user, updatedPost;
                var _a;
                return __generator(this, function (_b) {
                        switch (_b.label) {
                                case 0:
                                        return [4 /*yield*/, post_model_1.Post.find().exec()];
                                case 1:
                                        allPosts = _b.sent();
                                        posts = [];
                                        i = 0;
                                        _b.label = 2;
                                case 2:
                                        if (!(i < allPosts.length)) return [3 /*break*/, 5];
                                        item = allPosts[i];
                                        return [
                                                4 /*yield*/,
                                                user_model_1.User.findById({ _id: (_a = allPosts[i]) === null || _a === void 0 ? void 0 : _a.user }),
                                        ];
                                case 3:
                                        user = _b.sent();
                                        updatedPost = {
                                                comments: item === null || item === void 0 ? void 0 : item.comments,
                                                likes: item === null || item === void 0 ? void 0 : item.likes,
                                                _id: item === null || item === void 0 ? void 0 : item.id,
                                                message: item === null || item === void 0 ? void 0 : item.message,
                                                createdAt: item === null || item === void 0 ? void 0 : item.createdAt,
                                                image: item === null || item === void 0 ? void 0 : item.image,
                                                user: {
                                                        fullName: user === null || user === void 0 ? void 0 : user.fullName,
                                                        image: user === null || user === void 0 ? void 0 : user.image,
                                                        id: item === null || item === void 0 ? void 0 : item.user,
                                                },
                                        };
                                        posts.push(updatedPost);
                                        _b.label = 4;
                                case 4:
                                        i++;
                                        return [3 /*break*/, 2];
                                case 5:
                                        return [2 /*return*/, res.status(200).send({ posts: posts })];
                        }
                });
        });
};
exports.getAllPosts = getAllPosts;
function getPostsByUserFun(req, res) {
        return __awaiter(this, void 0, void 0, function () {
                var id, user, posts, p, item, searchPost, post;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        id = req.params.id;
                                        return [4 /*yield*/, user_model_1.User.findById({ _id: id })];
                                case 1:
                                        user = _a.sent();
                                        if (!user) return [3 /*break*/, 6];
                                        posts = [];
                                        p = 0;
                                        _a.label = 2;
                                case 2:
                                        if (!(p < user.posts.length)) return [3 /*break*/, 5];
                                        item = user.posts[p];
                                        return [4 /*yield*/, post_model_1.Post.findById(item)];
                                case 3:
                                        searchPost = _a.sent();
                                        post = {
                                                comments: searchPost === null || searchPost === void 0 ? void 0 : searchPost.comments,
                                                likes: searchPost === null || searchPost === void 0 ? void 0 : searchPost.likes,
                                                _id: searchPost === null || searchPost === void 0 ? void 0 : searchPost.id,
                                                message: searchPost === null || searchPost === void 0 ? void 0 : searchPost.message,
                                                user: {
                                                        fullName: user === null || user === void 0 ? void 0 : user.fullName,
                                                        image: user === null || user === void 0 ? void 0 : user.image,
                                                        id: id,
                                                },
                                                createdAt: searchPost === null || searchPost === void 0 ? void 0 : searchPost.createdAt,
                                                image: searchPost === null || searchPost === void 0 ? void 0 : searchPost.image,
                                        };
                                        posts.push(post);
                                        _a.label = 4;
                                case 4:
                                        p++;
                                        return [3 /*break*/, 2];
                                case 5:
                                        if (posts) {
                                                res.status(200).json({ posts: posts });
                                        } else {
                                                res.status(404);
                                        }
                                        _a.label = 6;
                                case 6:
                                        return [2 /*return*/];
                        }
                });
        });
}
exports.getPostsByUserFun = getPostsByUserFun;
var postCreate = function (data) {
        return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                        return [
                                2 /*return*/,
                                new Promise(function (resolve) {
                                        var newPost = post_model_1.Post.create(data);
                                        resolve(newPost);
                                }),
                        ];
                });
        });
};
function insertPostData(req, res) {
        return __awaiter(this, void 0, void 0, function () {
                var currentDate;
                var _this = this;
                return __generator(this, function (_a) {
                        currentDate = new Date();
                        req.body.createdAt = currentDate.getTime() / 1000;
                        return [
                                2 /*return*/,
                                postCreate(req.body).then(function (post) {
                                        return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                                case 0:
                                                                        return [
                                                                                4 /*yield*/,
                                                                                user_model_1.User.updateOne(
                                                                                        { _id: req.body.user },
                                                                                        { $push: { posts: post.id } },
                                                                                ),
                                                                        ];
                                                                case 1:
                                                                        _a.sent();
                                                                        res.status(200).json({ id: post.id });
                                                                        return [2 /*return*/];
                                                        }
                                                });
                                        });
                                }),
                        ];
                });
        });
}
exports.insertPostData = insertPostData;
var deletePost = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
                var postId, userId, takePost, error_1;
                return __generator(this, function (_a) {
                        switch (_a.label) {
                                case 0:
                                        postId = req.params.postId;
                                        userId = req.body.jwt.userId;
                                        return [4 /*yield*/, post_model_1.Post.findById(postId)];
                                case 1:
                                        takePost = _a.sent();
                                        if (!takePost) return [3 /*break*/, 6];
                                        return [4 /*yield*/, user_model_1.User.updateOne({ _id: userId }, { $pull: { posts: postId } })];
                                case 2:
                                        _a.sent();
                                        _a.label = 3;
                                case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, post_model_1.Post.findByIdAndDelete({ _id: postId })];
                                case 4:
                                        _a.sent();
                                        getPostByUser(userId).then(function (posts) {
                                                return __awaiter(void 0, void 0, void 0, function () {
                                                        var newsUpdate;
                                                        return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                        case 0:
                                                                                if (!posts) return [3 /*break*/, 2];
                                                                                return [4 /*yield*/, post_model_1.Post.find().exec()];
                                                                        case 1:
                                                                                newsUpdate = _a.sent();
                                                                                return [
                                                                                        2 /*return*/,
                                                                                        res.status(201).json({ user: posts, news: newsUpdate }),
                                                                                ];
                                                                        case 2:
                                                                                return [2 /*return*/, posts];
                                                                }
                                                        });
                                                });
                                        });
                                        return [3 /*break*/, 6];
                                case 5:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, res.status(403).json({ error: 'error', code: 403 })];
                                case 6:
                                        return [2 /*return*/, res.status(404).json({ message: 'Post not be found', code: 404 })];
                        }
                });
        });
};
exports.deletePost = deletePost;
