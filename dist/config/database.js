"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("../dotenv");
const uri = process.env.DB_URI || '';
const connectDb = () => {
    mongoose_1.default.connect(uri)
        .then(() => {
        console.log("Connnected to database");
    })
        .catch(() => {
        console.log("Connection failed");
    });
};
exports.connectDb = connectDb;
//# sourceMappingURL=database.js.map