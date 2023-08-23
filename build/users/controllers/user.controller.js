"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getTickets = exports.onChangeLocation = exports.userExistByEmail = exports.findByEmail = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.insertUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../model/user.model");
const index_1 = require("../../index");
const event_model_1 = require("../../events/model/event.model");
const createUser = async (data) => {
    const user = await user_model_1.User.create(data);
    return user;
};
const userExistByEmail = async (req, res) => {
    console.log(req.params);
    const { email } = req.params;
    const user = await user_model_1.User.findOne({ 'email': email }).exec();
    return res.send({ user: user });
};
exports.userExistByEmail = userExistByEmail;
const findByEmail = async (value) => new Promise((resolve, reject) => {
    user_model_1.User.find({ email: value }).exec((err, id) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(id);
        }
    });
});
exports.findByEmail = findByEmail;
const insertUser = async (req, res) => {
    const { data } = req.body;
    const pass = data.email;
    const salt = crypto_1.default.randomBytes(16).toString('base64');
    if (pass) {
        const hash = crypto_1.default.createHmac('sha512', salt).update(pass).digest('base64');
        data.password = `${salt}$${hash}`;
        if (data.email) {
            return createUser(data).then(async (user) => {
                await user_model_1.User.updateOne({ _id: user === null || user === void 0 ? void 0 : user._id }, { 'id': user === null || user === void 0 ? void 0 : user._id });
                const data = Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.toJSON()), { id: user === null || user === void 0 ? void 0 : user._id });
                return res.status(200).send(Object.assign({}, data));
            });
        }
        else {
            res.status(400).send({ message: 'Field email is required.', code: 400 });
        }
    }
    else {
        res.status(400).send({ message: 'Field password is required.', code: 400 });
    }
};
exports.insertUser = insertUser;
const getAllUsers = async (_req, res) => {
    const users = await user_model_1.User.find().exec();
    return res.status(200).json({ data: users });
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.User.findOne({ 'id': id });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ data: user });
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { jwt } = req.body;
    try {
        await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, req.body);
        const userUpdate = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
        return res.status(200).send(Object.assign({}, userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.toJSON()));
    }
    catch (error) {
        return res.status(404).json({ message: 'User not found', code: 404 });
    }
};
exports.updateUser = updateUser;
const onChangeLocation = async (req, res) => {
    const { jwt, userCountry } = req.body;
    try {
        await user_model_1.User.updateOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }, { userCountry: userCountry });
        const userUpdate = await user_model_1.User.findOne({ 'id': jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
        return res.status(200).send(Object.assign({}, userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.toJSON()));
    }
    catch (error) {
        return res.status(404).json({ message: 'User not found', code: 404 });
    }
};
exports.onChangeLocation = onChangeLocation;
const getTickets = async (req, res) => {
    const { jwt } = req.body;
    const user = await user_model_1.User.findOne({ _id: jwt === null || jwt === void 0 ? void 0 : jwt.userId }).exec();
    const tickets = user === null || user === void 0 ? void 0 : user.paidEvents;
    let allEvents = [];
    for (let index in tickets) {
        let currentTicket = tickets[index];
        const event = await event_model_1.Event.find({ _id: currentTicket.eventUid });
        const item = {
            currentTicket: currentTicket,
            event: event,
        };
        allEvents.push(item);
    }
    if (!tickets) {
        return res.status(404);
    }
    return res.status(200).json({ paidEvents: allEvents });
};
exports.getTickets = getTickets;
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    const paymentIntent = await index_1.stripe.paymentIntents.retrieve(id);
    return res.status(200).json({ paymentDetail: paymentIntent });
};
exports.getPaymentById = getPaymentById;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    await user_model_1.User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted successfully.' });
};
exports.deleteUser = deleteUser;
