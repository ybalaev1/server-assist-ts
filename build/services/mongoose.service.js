"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = require('dotenv');
mongoose_1.default.Promise = global.Promise;
const dbHost = process.env.db_host || 'mongo_db';
const dbUser = process.env.db_user || 'y1balaev';
const dbPass = process.env.db_pass || 'rVsueR6Q4UYwG6pb';
const dbName = process.env.db_name || 'dc';
const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}/dc?authSource=admin`;
const connectToDatabase = async () => {
    await dotenv.config();
    const options = {
        useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true, connectTimeoutMS: 500000,
    };
    await mongoose_1.default.connect(connectionString, options).then(function () {
        console.log('MongoDB is connected', connectionString);
    })
        .catch(function (err) {
        console.log('connected err', err);
    });
};
exports.connectToDatabase = connectToDatabase;
