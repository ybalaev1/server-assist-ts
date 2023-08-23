"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const decrypt = (message, key) => {
    try {
        const { iv, encryptedData } = message;
        const custom_key = crypto_1.default.scryptSync(key.toString(), 'salt', 32);
        const ive = Buffer.from(iv, 'hex');
        const encryptedText = Buffer.from(encryptedData, 'hex');
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', custom_key, ive);
        const cry = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return cry.toString();
    }
    catch (error) {
        return error;
    }
};
exports.decrypt = decrypt;
