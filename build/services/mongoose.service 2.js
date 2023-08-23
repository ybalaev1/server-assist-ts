"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
const connectToDatabase = async (port) => {
    const options = {
        useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
    };
    try {
        await mongoose_1.default.connect(`mongodb+srv://y1balaev:rVsueR6Q4UYwG6pb@cluster0.tozhfgs.mongodb.net/testingDB?retryWrites=true&w=majority`, options);
    }
    catch (error) {
        console.log('connectToDatabase', error);
    }
};
exports.connectToDatabase = connectToDatabase;
