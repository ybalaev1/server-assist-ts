"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshPassword = exports.validJWTNeeded = exports.login = void 0;
const user_model_1 = require("../../../users/model/user.model");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecret = 'yUdmI2BvcLZ8g1lh3f9JztLlkL3NA9gQ';
const login = async (req, res, next) => {
    var _a;
    console.log('user eq.body', req.body);
    const { email } = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data_auth;
    const user = await user_model_1.User.findOne({ 'email': email }).exec();
    if (!user) {
        return res.status(404).json({ status: 400, message: 'User don`t exist ' });
    }
    const body = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        email: email,
        provider: 'email',
    };
    const token = jwt.sign(body, jwtSecret);
    return res.status(200).json({ id: body === null || body === void 0 ? void 0 : body.userId, accessToken: token, user: user === null || user === void 0 ? void 0 : user.toJSON() });
};
exports.login = login;
const validJWTNeeded = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const auth = req.headers.authorization.split(' ');
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
const refreshPassword = async (req, res) => {
    const { jwt, new_pass } = req.body;
    console.log('refreshPassword', req.body, new_pass);
    const user = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
    if (!user) {
        return res.status(404).json({ status: 400, message: 'User don`t exist ' });
    }
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(new_pass).digest('base64');
    req.body.password = salt + '$' + hash;
    await user_model_1.User.updateOne({ _id: user === null || user === void 0 ? void 0 : user.id }, req.body);
    return res.status(200).json({ message: 'New password has been updated', code: 200 });
};
exports.refreshPassword = refreshPassword;
