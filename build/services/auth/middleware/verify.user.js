"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidFields = exports.matchUserAndPassword = void 0;
const user_model_1 = require("../../../users/model/user.model");
const crypto = require('crypto');
const authValidFields = async (req, res, next) => {
    const { data_auth } = req.body;
    if (data_auth) {
        if (!data_auth.email) {
            return res.status(422).json({ message: 'The fields email are required' });
        }
        if (!data_auth.password) {
            return res.status(422).json({ message: 'The fields password are required' });
        }
    }
    else {
        return res.status(400).json({ message: 'Missing email and password' });
    }
    return next();
};
exports.authValidFields = authValidFields;
const matchUserAndPassword = async (req, res, next) => {
    const { data_auth } = req.body;
    console.log('matchUserAndPassword', req.body);
    const user = await user_model_1.User.findOne({ 'email': data_auth === null || data_auth === void 0 ? void 0 : data_auth.email }).exec();
    console.log('matchUserAndPassword', user);
    if (user !== null) {
        const passField = user.password.split('$');
        const salt = passField[0];
        const hash = crypto.createHmac('sha512', salt).update(data_auth.email).digest('base64');
        if (hash === passField[1]) {
            req.body.data_auth = {
                userId: user.id,
                email: user.email,
                provider: 'email',
                userName: user.userName,
            };
            return next();
        }
        else {
            return res.status(400).json({ message: 'Invalid e-mail or password' });
        }
    }
    else {
        res.status(404).json({ status: 404, message: 'User don`t exist ' });
    }
};
exports.matchUserAndPassword = matchUserAndPassword;
