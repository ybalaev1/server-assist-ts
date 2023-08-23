"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketTyping = exports.lattestMessage = exports.createMessage = exports.getMarkerRead = exports.markConversationReadByChatId = exports.deleteMessage = exports.getConversationByRoomId = exports.getDataChatById = exports.getChats = exports.postMessageChat = exports.insertChat = void 0;
const user_model_1 = require("../../users/model/user.model");
const chats_model_1 = require("../models/chats.model");
const encryption_1 = require("../../services/crypto/encryption");
const decryption_1 = require("../../services/crypto/decryption");
const createChat = async (data) => {
    const chat = await chats_model_1.Chat.create(data);
    return chat;
};
const markMessageRead = async (chat_id, user) => {
    try {
        return chats_model_1.Message.updateMany({
            chat_id,
            'readByRecipients.readByUserId': { $ne: user },
        }, {
            $addToSet: {
                readByRecipients: { readByUserId: user },
            },
        }, {
            multi: true,
        });
    }
    catch (error) {
        throw error;
    }
};
const markConversationReadByChatId = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body.jwt;
        const chat = await chats_model_1.Chat.findById(id);
        if (!chat) {
            return res.status(400).json({
                success: false,
                message: 'No chat exists for this id',
            });
        }
        const result = await markMessageRead(id, userId);
        return res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        return res.status(500).json({ success: false, error });
    }
};
exports.markConversationReadByChatId = markConversationReadByChatId;
const getDataChatById = async (req, res) => {
    const { id } = req.params;
    const { jwt } = req.body;
    const chat = await chats_model_1.Chat.findById({ _id: id });
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }
    if (jwt.userId !== chat.users[0] && jwt.userId !== chat.users[1]) {
        return res.status(404).json({ message: 'Chat not found' });
    }
    if (chat.users[0] === jwt.userId && chat.users[1] === jwt.userId) {
        const last = (0, decryption_1.decrypt)(chat.latestMessage[0], id);
        const favoriteUser = {
            user: {
                fullName: 'Favorite messages',
            },
            latestMessage: last,
            favorite: true,
            id,
            chat,
        };
        return res.status(200).json({ data: favoriteUser });
    }
    const user = await user_model_1.User.findById({ _id: jwt.userId });
    const user_id = user === null || user === void 0 ? void 0 : user._id.toString();
    const currentUser = chat.users.filter((u) => u !== user_id).toString();
    const costumer = await user_model_1.User.findById({ _id: currentUser });
    const last = (0, decryption_1.decrypt)(chat.latestMessage[0], id);
    if (last) {
        const newDataChat = {
            user: {
                fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
                image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
            },
            latestMessage: last,
            chat,
        };
        return res.status(200).send({ data: newDataChat });
    }
    const newDataChat = {
        user: {
            fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
            image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
        },
        chat,
    };
    return res.status(200).send({ data: newDataChat });
};
exports.getDataChatById = getDataChatById;
const getChats = async (req, res) => {
    const { jwt } = req.body;
    const user = await user_model_1.User.findById({ _id: jwt.userId }).exec();
    const user_id = user === null || user === void 0 ? void 0 : user._id.toString();
    const data = await chats_model_1.Chat.find({ users: user_id });
    const chat_messages = data;
    for (let i = 0; i < chat_messages.length; i++) {
        const element = chat_messages[i].latestMessage[0];
        const item = (0, decryption_1.decrypt)(element, chat_messages[i]._id);
        data[i].latestMessage = item;
    }
    res.status(200).json({ data });
};
exports.getChats = getChats;
const getMarkerRead = async (req, res) => {
    const { id } = req.params;
    const conversation = await chats_model_1.Message.aggregate([
        { $match: { chat_id: id } },
        { $sort: { createdAt: -1 } },
        { $unwind: '$readByRecipients' },
        {
            $group: {
                _id: '$chat_id',
                chat_id: { $last: '$chat_id' },
                message: { $last: '$message' },
                readByRecipients: { $addToSet: '$readByRecipients' },
                createdAt: { $last: '$createdAt' },
            },
        },
    ]);
    return res.status(200).json({
        conversation,
    });
};
exports.getMarkerRead = getMarkerRead;
const getConversationByRoomId = async (req, res) => {
    const { id } = req.params;
    const { jwt } = req.body;
    const chat = await chats_model_1.Chat.findById({ _id: id });
    if (!chat) {
        return res.status(400).json({
            message: 'No chat exists for this id',
        });
    }
    if (jwt.userId !== chat.users[0] && jwt.userId !== chat.users[1]) {
        return res.status(404).json({ message: 'Chat not found' });
    }
    const conversation = await chats_model_1.Message.aggregate([{ $match: { chat_id: id } }, { $sort: { createdAt: 1 } }, { $unwind: '$user_id' }]);
    const chat_messages = conversation;
    for (let i = 0; i < chat_messages.length; i++) {
        const element = chat_messages[i].message[0];
        const item = (0, decryption_1.decrypt)(element, id);
        conversation[i].message = item;
    }
    return res.status(200).json({
        conversation,
    });
};
exports.getConversationByRoomId = getConversationByRoomId;
const createMessage = async (data) => {
    const hash = (0, encryption_1.encrypt)(data.message, data.chat_id);
    data.message = hash;
    const mes = await chats_model_1.Message.create(data);
    const mess_id = mes === null || mes === void 0 ? void 0 : mes._id;
    const dec_message = (0, decryption_1.decrypt)(data.message, data.chat_id);
    const last_user = await user_model_1.User.findById({ _id: mes.user_id });
    const crntChat = await chats_model_1.Chat.findById({ _id: data.chat_id });
    markMessageRead(data.chat_id, mes.user_id);
    await chats_model_1.Chat.replaceOne({ _id: data.chat_id }, {
        latestMessage: mes.message,
        users: crntChat === null || crntChat === void 0 ? void 0 : crntChat.users,
        last_user: last_user === null || last_user === void 0 ? void 0 : last_user.fullName,
        updatedAt: new Date(),
    });
    const recievedMessage = {
        message: dec_message,
        chat_id: mes.chat_id,
        user_id: mes.user_id,
        createdAt: mes.createdAt,
        _id: mess_id,
        readByRecipients: { readByUserId: mes.user_id },
    };
    return recievedMessage;
};
exports.createMessage = createMessage;
const lattestMessage = async (id) => {
    const conversation = await chats_model_1.Message.find({ chat_id: id }).sort({ createdAt: 1 });
    const chat_messages = conversation;
    for (let i = 0; i < chat_messages.length; i++) {
        const element = chat_messages[i].message[0];
        const item = (0, decryption_1.decrypt)(element, id);
        conversation[i].message = item;
    }
    return conversation;
};
exports.lattestMessage = lattestMessage;
const insertChat = async (req, res) => {
    const { data } = req.body;
    const { userId } = req.body.jwt;
    if (!data) {
        return res.status(401).json({ message: 'Need data', code: 401 });
    }
    if (!data.costumer) {
        return res.status(401).json({ message: 'Need costumer', code: 401 });
    }
    if (!data.initiator) {
        return res.status(401).json({ message: 'Need initiator', code: 401 });
    }
    if (data.costumer === data.initiator) {
        data.favorite = true;
        data.user = {
            fullName: 'Favorite messages',
        };
    }
    data.users = [data.costumer, data.initiator];
    const currentUser = data.users.filter((u) => u !== userId).toString();
    const costumer = await user_model_1.User.findById({ _id: currentUser });
    data.user = {
        fullName: costumer === null || costumer === void 0 ? void 0 : costumer.fullName,
        image: costumer === null || costumer === void 0 ? void 0 : costumer.image,
    };
    return createChat(data).then((createdChat) => {
        res.status(200).send({ id: createdChat.id });
    });
};
exports.insertChat = insertChat;
const postMessageChat = async (req, res) => {
    const { data, jwt } = req.body;
    const { id } = req.params;
    const message_data = {
        message: data.message,
        user_id: jwt.userId,
        chat_id: id,
        createdAt: new Date(),
        readByRecipients: { readByUserId: jwt.userId },
    };
    return createMessage(message_data).then(async (createMess) => {
        const currentChat = await chats_model_1.Chat.findById({ _id: id });
        const lastUser = await user_model_1.User.findById({ _id: jwt.userId });
        await chats_model_1.Chat.replaceOne({ _id: currentChat === null || currentChat === void 0 ? void 0 : currentChat._id }, {
            latestMessage: createMess,
            last_user: lastUser === null || lastUser === void 0 ? void 0 : lastUser.fullName,
            users: currentChat === null || currentChat === void 0 ? void 0 : currentChat.users,
            updatedAt: new Date(),
        });
        res.status(200).send({ data: createMess });
    });
};
exports.postMessageChat = postMessageChat;
const getSocketTyping = async (user_id) => {
    const user = await user_model_1.User.findById({ _id: user_id });
    return user;
};
exports.getSocketTyping = getSocketTyping;
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const message = await chats_model_1.Message.deleteOne({ _id: id });
    return res.status(200).json({ message });
};
exports.deleteMessage = deleteMessage;
