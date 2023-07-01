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
exports.insertCommunity = exports.getCommunityById = exports.getAllCommunities = exports.updateCommunity = exports.deleteCommunity = void 0;
var community_model_1 = require("../model/community.model");
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
    var data;
    return __generator(this, function (_a) {
        data = req.body.data;
        console.log('insertCommunity', req.body);
        if (data.title) {
            if (!data.description) {
                res.status(400).send({ message: 'Field description is required.', code: 400 });
            }
            else {
                return [2, createCommunity(data).then(function (community) {
                        res.status(200).json({ id: community._id });
                    }).catch(function (er) { return res.status(422).send({ message: er === null || er === void 0 ? void 0 : er.message }); })];
            }
        }
        else {
            res.status(400).send({ message: 'Field title is required.', code: 400 });
        }
        throw Error();
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
                console.log('getAllCommunities', communities);
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
                return [4, community_model_1.Community.findOne({ _id: id })];
            case 1:
                community = _a.sent();
                if (!community) {
                    return [2, res.status(404).json({ message: 'Community not found' })];
                }
                return [2, res.status(200).json({ data: community })];
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
                return [4, community_model_1.Community.updateOne({ _id: id }, req.body)];
            case 2:
                _a.sent();
                return [4, community_model_1.Community.findById({ _id: id })];
            case 3:
                communityUpdated = _a.sent();
                return [2, res.status(200).send({ data: communityUpdated })];
            case 4:
                error_1 = _a.sent();
                return [2, res.status(404).json({ message: 'Community not found', code: 404 })];
            case 5: return [2];
        }
    });
}); };
exports.updateCommunity = updateCommunity;
var deleteCommunity = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, community_model_1.Community.findByIdAndDelete(id)];
            case 1:
                _a.sent();
                return [2, res.status(200).json({ message: 'Community deleted successfully.' })];
        }
    });
}); };
exports.deleteCommunity = deleteCommunity;
