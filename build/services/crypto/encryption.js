"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (message, key) => {
    const custom_key = crypto_1.default.scryptSync(key, 'salt', 32);
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', custom_key, iv);
    let encrypted = cipher.update(message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
    };
};
exports.encrypt = encrypt;
