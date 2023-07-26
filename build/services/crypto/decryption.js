"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
var crypto_1 = __importDefault(require("crypto"));
var decrypt = function (message, key) {
    try {
        var iv = message.iv, encryptedData = message.encryptedData;
        var custom_key = crypto_1.default.scryptSync(key.toString(), 'salt', 32);
        var ive = Buffer.from(iv, 'hex');
        var encryptedText = Buffer.from(encryptedData, 'hex');
        var decipher = crypto_1.default.createDecipheriv('aes-256-cbc', custom_key, ive);
        var cry = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return cry.toString();
    }
    catch (error) {
        return error;
    }
};
exports.decrypt = decrypt;
