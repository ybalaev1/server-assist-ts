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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unSubscribeCommunity = exports.subscribeCommunity = exports.insertCommunity = exports.getCommunityById = exports.getAllCommunities = exports.updateCommunity = exports.deleteCommunity = void 0;
var community_model_1 = require("../model/community.model");
var user_model_1 = require("../../users/model/user.model");
var createCommunity = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var community;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, community_model_1.Community.create(data)];
            case 1:
                community = _a.sent();
                return [2, community];
        }
    });
}); };
var insertCommunity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, jwt, user, requestData;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = req.body.data;
                jwt = req.body.jwt;
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId })];
            case 1:
                user = _b.sent();
                requestData = __assign(__assign({}, data), { creator: {
                        uid: user === null || user === void 0 ? void 0 : user.id,
                        image: (_a = user === null || user === void 0 ? void 0 : user.userImage) !== null && _a !== void 0 ? _a : null,
                        name: user === null || user === void 0 ? void 0 : user.userName,
                    } });
                if (data.title) {
                    if (data.description) {
                        return [2, createCommunity(requestData).then(function (community) { return __awaiter(void 0, void 0, void 0, function () {
                                var myCommunities, data;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            console.log('comm', community);
                                            myCommunities = !((_a = user === null || user === void 0 ? void 0 : user.myCommunities) === null || _a === void 0 ? void 0 : _a.length) ? [community === null || community === void 0 ? void 0 : community._id] : __spreadArray(__spreadArray([], user === null || user === void 0 ? void 0 : user.myCommunities, true), [community === null || community === void 0 ? void 0 : community._id], false);
                                            return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { myCommunities: myCommunities } })];
                                        case 1:
                                            _b.sent();
                                            return [4, community_model_1.Community.updateOne({ _id: community === null || community === void 0 ? void 0 : community._id }, { 'id': community === null || community === void 0 ? void 0 : community._id })];
                                        case 2:
                                            _b.sent();
                                            data = __assign(__assign({}, community === null || community === void 0 ? void 0 : community.toJSON()), { id: community === null || community === void 0 ? void 0 : community._id });
                                            return [2, res.status(200).json(__assign({}, data))];
                                    }
                                });
                            }); }).catch(function (er) {
                                return res.status(500).json({ error: er });
                            })];
                    }
                    else {
                        res.status(400).send({ message: 'Field description is required.', code: 400, filed: 'description' });
                    }
                }
                else {
                    res.status(400).send({ message: 'Field title is required.', code: 400, filed: 'title' });
                }
                return [2];
        }
    });
}); };
exports.insertCommunity = insertCommunity;
var getAllCommunities = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var communities;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, community_model_1.Community.find().exec()];
            case 1:
                communities = _a.sent();
                return [2, res.status(200).json({ data: communities })];
        }
    });
}); };
exports.getAllCommunities = getAllCommunities;
var getCommunityById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, community;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, community_model_1.Community.findOne({ 'id': id }).exec()];
            case 1:
                community = _a.sent();
                if (!community) {
                    return [2, res.status(404).json({ message: 'Community not found' })];
                }
                return [2, res.status(200).json(__assign({}, community === null || community === void 0 ? void 0 : community.toJSON()))];
        }
    });
}); };
exports.getCommunityById = getCommunityById;
var updateCommunity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, communityUpdated, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4, community_model_1.Community.updateOne({ 'id': id }, req.body.data)];
            case 2:
                _a.sent();
                return [4, community_model_1.Community.findOne({ 'id': id }).exec()];
            case 3:
                communityUpdated = _a.sent();
                return [2, res.status(200).send(__assign({}, communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON()))];
            case 4:
                error_1 = _a.sent();
                return [2, res.status(404).json({ message: 'Community not found', code: 404 })];
            case 5: return [2];
        }
    });
}); };
exports.updateCommunity = updateCommunity;
var deleteCommunity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, community, creatorId, user, communities;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                return [4, community_model_1.Community.findOne({ 'id': id })];
            case 1:
                community = _c.sent();
                creatorId = (community === null || community === void 0 ? void 0 : community.creatorUid) || ((_a = community === null || community === void 0 ? void 0 : community.creator) === null || _a === void 0 ? void 0 : _a.uid);
                return [4, user_model_1.User.findOne({ 'id': creatorId })];
            case 2:
                user = _c.sent();
                communities = (_b = user === null || user === void 0 ? void 0 : user.myCommunities) === null || _b === void 0 ? void 0 : _b.filter(function (i) { return i !== id; });
                return [4, user_model_1.User.updateOne({ 'id': creatorId }, { $set: { myCommunities: communities } })];
            case 3:
                _c.sent();
                return [4, community_model_1.Community.findByIdAndDelete(id)];
            case 4:
                _c.sent();
                return [2, res.status(200).json({ message: 'Community deleted successfully.' })];
        }
    });
}); };
exports.deleteCommunity = deleteCommunity;
var subscribeCommunity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, jwt, community, user, userUid, userCommunities, followers, communityUpdated;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                jwt = req.body.jwt;
                return [4, community_model_1.Community.findOne({ 'id': id })];
            case 1:
                community = _c.sent();
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId })];
            case 2:
                user = _c.sent();
                userUid = jwt === null || jwt === void 0 ? void 0 : jwt.userId;
                userCommunities = !((_a = user === null || user === void 0 ? void 0 : user.joinedCommunities) === null || _a === void 0 ? void 0 : _a.length) ? [id] : __spreadArray(__spreadArray([], user === null || user === void 0 ? void 0 : user.joinedCommunities, true), [id], false);
                followers = !((_b = community === null || community === void 0 ? void 0 : community.followers) === null || _b === void 0 ? void 0 : _b.length) ? [userUid] : __spreadArray(__spreadArray([], community === null || community === void 0 ? void 0 : community.followers, true), [{ 'userUid': userUid }], false);
                return [4, user_model_1.User.updateOne({ 'id': userUid }, { $set: { joinedCommunities: userCommunities } })];
            case 3:
                _c.sent();
                return [4, community_model_1.Community.updateOne({ 'id': id }, { $set: { followers: followers } })];
            case 4:
                _c.sent();
                return [4, community_model_1.Community.findOne({ 'id': id })];
            case 5:
                communityUpdated = _c.sent();
                return [2, res.status(200).send(__assign({}, communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON()))];
        }
    });
}); };
exports.subscribeCommunity = subscribeCommunity;
var unSubscribeCommunity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, jwt, community, user, userUid, userCommunities, followers, communityUpdated;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                jwt = req.body.jwt;
                return [4, community_model_1.Community.findOne({ 'id': id })];
            case 1:
                community = _c.sent();
                return [4, user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId })];
            case 2:
                user = _c.sent();
                userUid = jwt === null || jwt === void 0 ? void 0 : jwt.userId;
                userCommunities = (_a = user === null || user === void 0 ? void 0 : user.joinedCommunities) === null || _a === void 0 ? void 0 : _a.filter(function (i) { return i !== id; });
                followers = (_b = community === null || community === void 0 ? void 0 : community.followers) === null || _b === void 0 ? void 0 : _b.filter(function (i) { return i.userUid !== userUid; });
                return [4, user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { joinedCommunities: userCommunities } })];
            case 3:
                _c.sent();
                return [4, community_model_1.Community.updateOne({ 'id': id }, { $set: { followers: followers } })];
            case 4:
                _c.sent();
                return [4, community_model_1.Community.findOne({ 'id': id })];
            case 5:
                communityUpdated = _c.sent();
                return [2, res.status(200).send(__assign({}, communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON()))];
        }
    });
}); };
exports.unSubscribeCommunity = unSubscribeCommunity;
