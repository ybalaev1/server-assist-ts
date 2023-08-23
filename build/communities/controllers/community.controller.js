"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserImagesFromCommunity = exports.getManagingCommunities = exports.unSubscribeCommunity = exports.subscribeCommunity = exports.insertCommunity = exports.getCommunityById = exports.getAllCommunities = exports.updateCommunity = exports.deleteCommunity = exports.getCommunities = void 0;
const community_model_1 = require("../model/community.model");
const user_model_1 = require("../../users/model/user.model");
const event_model_1 = require("../../events/model/event.model");
const index_1 = require("../../index");
const createCommunity = async (data) => {
    const community = await community_model_1.Community.create(data);
    return community;
};
const insertCommunity = async (req, res) => {
    var _a;
    const { data } = req.body;
    const { jwt } = req.body;
    const user = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId });
    const requestData = Object.assign(Object.assign({}, data), { creator: {
            uid: user === null || user === void 0 ? void 0 : user.id,
            image: (_a = user === null || user === void 0 ? void 0 : user.userImage) !== null && _a !== void 0 ? _a : null,
            name: user === null || user === void 0 ? void 0 : user.userName,
        }, followers: [{ userUid: user === null || user === void 0 ? void 0 : user.id }] });
    if (data.title) {
        if (data.description) {
            return createCommunity(requestData).then(async (community) => {
                var _a;
                const myCommunities = !((_a = user === null || user === void 0 ? void 0 : user.myCommunities) === null || _a === void 0 ? void 0 : _a.length) ? [community === null || community === void 0 ? void 0 : community._id] : [...user === null || user === void 0 ? void 0 : user.myCommunities, community === null || community === void 0 ? void 0 : community._id];
                await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { myCommunities: myCommunities } });
                await community_model_1.Community.updateOne({ _id: community === null || community === void 0 ? void 0 : community._id }, { 'id': community === null || community === void 0 ? void 0 : community._id });
                const data = Object.assign(Object.assign({}, community === null || community === void 0 ? void 0 : community.toJSON()), { id: community === null || community === void 0 ? void 0 : community._id });
                return res.status(200).json(Object.assign({}, data));
            }).catch((er) => {
                return res.status(500).json({ error: er });
            });
        }
        else {
            res.status(400).send({ message: 'Field description is required.', code: 400, filed: 'description' });
        }
    }
    else {
        res.status(400).send({ message: 'Field title is required.', code: 400, filed: 'title' });
    }
};
exports.insertCommunity = insertCommunity;
const getUserImagesFromCommunity = async (req, res) => {
    const { id } = req.params;
    const community = await community_model_1.Community.findOne({ _id: id }).exec();
    const followers = community === null || community === void 0 ? void 0 : community.followers.map(i => i.userUid);
    const records = await user_model_1.User.find({ '_id': { $in: followers } }, 'userImage');
    return res.status(200).json(Object.assign({}, records));
};
exports.getUserImagesFromCommunity = getUserImagesFromCommunity;
const getAllCommunities = async (req, res) => {
    const { location } = req.params;
    let results;
    const cachedCommunities = await index_1.redisClient.get('communities');
    if (cachedCommunities) {
        results = JSON.parse(cachedCommunities);
    }
    else {
        results = await community_model_1.Community.find({ 'location': location }).exec();
        if (results.length === 0)
            throw "API error";
        await index_1.redisClient.set('communities', JSON.stringify(results));
    }
    if (!results.length) {
        return res.status(404).json({ message: 'Communities not found' });
    }
    return res.status(200).json({ data: results });
};
exports.getAllCommunities = getAllCommunities;
const getCommunityById = async (req, res) => {
    var _a;
    const { id } = req.params;
    const community = await community_model_1.Community.findOne({ 'id': id }).exec();
    const creator = await user_model_1.User.findOne({ 'id': (_a = community === null || community === void 0 ? void 0 : community.creator) === null || _a === void 0 ? void 0 : _a.uid }).exec();
    const data = Object.assign(Object.assign({}, community === null || community === void 0 ? void 0 : community.toJSON()), { creator: Object.assign(Object.assign({}, community === null || community === void 0 ? void 0 : community.creator), { image: creator === null || creator === void 0 ? void 0 : creator.userImage }) });
    if (!community) {
        return res.status(404).json({ message: 'Community not found' });
    }
    return res.status(200).json(Object.assign({}, data));
};
exports.getCommunityById = getCommunityById;
const getManagingCommunities = async (req, res) => {
    const { jwt } = req.body;
    const userId = jwt === null || jwt === void 0 ? void 0 : jwt.userId;
    const communitiesData = await community_model_1.Community.find().exec();
    const communities = communitiesData === null || communitiesData === void 0 ? void 0 : communitiesData.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.creator) === null || _a === void 0 ? void 0 : _a.uid) === userId; });
    if (!communitiesData.length) {
        return res.status(404).json({ message: 'communities not found', code: 404 });
    }
    return res.status(200).json({ data: communities });
};
exports.getManagingCommunities = getManagingCommunities;
const updateCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        await community_model_1.Community.updateOne({ 'id': id }, req.body.data);
        const communityUpdated = await community_model_1.Community.findOne({ 'id': id }).exec();
        return res.status(200).send(Object.assign({}, communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON()));
    }
    catch (error) {
        return res.status(404).json({ message: 'Community not found', code: 404 });
    }
};
exports.updateCommunity = updateCommunity;
const deleteCommunity = async (req, res) => {
    var _a, _b, _c;
    const { id } = req.params;
    const community = await community_model_1.Community.findOne({ 'id': id });
    const creatorId = (_a = community === null || community === void 0 ? void 0 : community.creator) === null || _a === void 0 ? void 0 : _a.uid;
    const user = await user_model_1.User.findOne({ 'id': creatorId });
    const communities = (_b = user === null || user === void 0 ? void 0 : user.myCommunities) === null || _b === void 0 ? void 0 : _b.filter(i => i !== id);
    (_c = community === null || community === void 0 ? void 0 : community.eventsIds) === null || _c === void 0 ? void 0 : _c.map(async (value) => {
        const idEvent = await event_model_1.Event.findOne({ _id: value });
        await event_model_1.Event.findByIdAndDelete(idEvent);
    });
    await user_model_1.User.updateOne({ 'id': creatorId }, { $set: { myCommunities: communities } });
    await community_model_1.Community.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Community deleted successfully.' });
};
exports.deleteCommunity = deleteCommunity;
const subscribeCommunity = async (communityUid, userUid, socket) => {
    var _a, _b, _c, _d, _e;
    const community = await community_model_1.Community.findOne({ _id: communityUid }).exec();
    const user = await user_model_1.User.findOne({ _id: userUid }).exec();
    const isAvailable = ((_a = community === null || community === void 0 ? void 0 : community.followers) === null || _a === void 0 ? void 0 : _a.length) && (community === null || community === void 0 ? void 0 : community.followers.map(follower => follower).find(user => user.userUid === userUid));
    const newUser = { 'userUid': userUid };
    const newFollowers = community === null || community === void 0 ? void 0 : community.followers.concat(newUser);
    if (isAvailable) {
        const followers = (_b = community === null || community === void 0 ? void 0 : community.followers) === null || _b === void 0 ? void 0 : _b.filter(i => i.userUid !== userUid);
        const userCommunities = (_c = user === null || user === void 0 ? void 0 : user.joinedCommunities) === null || _c === void 0 ? void 0 : _c.filter(i => i !== communityUid);
        await community_model_1.Community.updateOne({ _id: communityUid }, { $set: { followers: followers } });
        await user_model_1.User.updateOne({ _id: userUid }, { $set: { joinedCommunities: userCommunities } });
        const communityUpdated = await community_model_1.Community.findOne({ _id: communityUid });
        const communities = await community_model_1.Community.find({ 'location': community === null || community === void 0 ? void 0 : community.location }).exec();
        const records = await user_model_1.User.find({ _id: { $in: communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.followers.map(i => i.userUid) } }, 'userImage');
        const data = {
            communities: communities,
            currentCommunity: communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON(),
            userImages: records,
        };
        return data;
    }
    else {
        const userCommunities = !((_d = user === null || user === void 0 ? void 0 : user.joinedCommunities) === null || _d === void 0 ? void 0 : _d.length) ? [communityUid] : [...user === null || user === void 0 ? void 0 : user.joinedCommunities, communityUid];
        const followers = !((_e = community === null || community === void 0 ? void 0 : community.followers) === null || _e === void 0 ? void 0 : _e.length) ? [{ 'userUid': userUid }] : newFollowers;
        await user_model_1.User.updateOne({ _id: userUid }, { $set: { joinedCommunities: userCommunities } });
        await community_model_1.Community.updateOne({ _id: communityUid }, { $set: { followers: followers } });
        const communityUpdated = await community_model_1.Community.findOne({ _id: communityUid });
        const communities = await community_model_1.Community.find({ 'location': community === null || community === void 0 ? void 0 : community.location }).exec();
        const records = await user_model_1.User.find({ _id: { $in: newFollowers === null || newFollowers === void 0 ? void 0 : newFollowers.map(i => i.userUid) } }, 'userImage');
        const data = {
            communities: communities,
            currentCommunity: communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON(),
            userImages: records,
        };
        return data;
    }
};
exports.subscribeCommunity = subscribeCommunity;
const unSubscribeCommunity = async (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const { jwt } = req.body;
    console.log('unSubscribeCommunity jwt', jwt, id);
    const community = await community_model_1.Community.findOne({ 'id': id });
    const user = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId });
    const userUid = jwt === null || jwt === void 0 ? void 0 : jwt.userId;
    const userCommunities = (_a = user === null || user === void 0 ? void 0 : user.joinedCommunities) === null || _a === void 0 ? void 0 : _a.filter(i => i !== id);
    const followers = (_b = community === null || community === void 0 ? void 0 : community.followers) === null || _b === void 0 ? void 0 : _b.filter((i) => i !== userUid);
    console.log('unSubscribeCommunity', userUid, userCommunities, followers);
    await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { $set: { joinedCommunities: userCommunities } });
    await community_model_1.Community.updateOne({ 'id': id }, { $set: { followers: followers } });
    const communityUpdated = await community_model_1.Community.findOne({ 'id': id });
    return res.status(200).send(Object.assign({}, communityUpdated === null || communityUpdated === void 0 ? void 0 : communityUpdated.toJSON()));
};
exports.unSubscribeCommunity = unSubscribeCommunity;
const getCommunities = async (location) => {
    const communities = await community_model_1.Community.find({ 'location': location }).exec();
    return communities;
};
exports.getCommunities = getCommunities;
