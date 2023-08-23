"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConstants = void 0;
const constans_model_1 = require("../model/constans.model");
const getConstants = async (req, res) => {
    const appConstants = await constans_model_1.Constans.find().exec();
    return res.status(200).json({ data: appConstants });
};
exports.getConstants = getConstants;
