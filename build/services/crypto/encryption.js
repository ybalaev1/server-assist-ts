"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
var crypto_1 = __importDefault(require("crypto"));
// const key = crypto.scryptSync('secret', 'salt', 32);
var encrypt = function (message, key) {
    var custom_key = crypto_1.default.scryptSync(key, 'salt', 32);
    var iv = crypto_1.default.randomBytes(16);
    var cipher = crypto_1.default.createCipheriv('aes-256-cbc', custom_key, iv);
    var encrypted = cipher.update(message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
    };
};
exports.encrypt = encrypt;
