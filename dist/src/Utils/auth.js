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
exports.checkAdministratorForFrontend = exports.checkAuthenticationForFrontend = exports.checkAdministrator = exports.checkAuthentication = exports.tokenToId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const User_1 = require("../models/User");
const tokenToId = (token) => {
    try {
        const parsedAccessToken = JSON.parse(token);
        const decodedToken = jsonwebtoken_1.default.verify(parsedAccessToken, JWT_SECRET);
        return decodedToken.userId;
    }
    catch (err) {
        console.error('error while parsing and verifing accessToken in tokenToId at auth.ts', err);
        return null;
    }
};
exports.tokenToId = tokenToId;
const checkAuthentication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.accesstoken;
    const id = (0, exports.tokenToId)(accessToken);
    if (!id) {
        throw new Error('Invalid access token');
    }
    const user = yield User_1.User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.checkAuthentication = checkAuthentication;
const checkAdministrator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.checkAuthentication)(req, res);
        if (user.role !== 'administrator') {
            throw new Error('User is not an administrator');
        }
        return user;
    }
    catch (err) {
        console.error("Error while checking administrator in checkAdministrator at auth.ts", err);
    }
});
exports.checkAdministrator = checkAdministrator;
const checkAuthenticationForFrontend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.checkAuthentication)(req, res);
        return res.status(200).json({ message: 'User is authenticated', user });
    }
    catch (err) {
        console.error("Error while checking authentication at userFeatures.ts", err);
        return res.status(401).json({ message: 'Error while checking authentication in checkAuthentication at auth.ts', err });
    }
});
exports.checkAuthenticationForFrontend = checkAuthenticationForFrontend;
const checkAdministratorForFrontend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, exports.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at auth.ts');
        return res.status(401).json({ message: 'Error while checking admin user at auth.ts' });
    }
    return res.status(200).json({ message: 'User is an administrator', adminUser });
});
exports.checkAdministratorForFrontend = checkAdministratorForFrontend;
//# sourceMappingURL=auth.js.map