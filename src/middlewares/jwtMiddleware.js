"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../../dotenv");
const JWT_SECRET = process.env.JWT_SECRET || "";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch (error) {
        console.error('Error verifying token', error);
        return res.status(403).json({ error: 'Error verifying token' });
    }
};
exports.authenticateToken = authenticateToken;
