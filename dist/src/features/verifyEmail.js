"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailF = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const verifyEmailF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (token) {
        const secret = process.env.JWT_SECRET || '';
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const email = decoded.email;
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.isVerified = true;
            yield user.save();
            return res.status(201).json({ message: 'Email verified successfully' });
        }
        catch (error) {
            console.error('Error verifying email:', error);
            return res.status(500).json({ message: 'Error verifying email' });
        }
    }
    else {
        return res.status(400).json({ message: 'No token provided' });
    }
});
exports.verifyEmailF = verifyEmailF;
//# sourceMappingURL=verifyEmail.js.map