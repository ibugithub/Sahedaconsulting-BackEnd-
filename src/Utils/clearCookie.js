"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookie = void 0;
const clearCookie = (res, cookieName) => {
    res.clearCookie(cookieName);
    return res.status(200).json({ message: 'cookie cleared successfully' });
};
exports.clearCookie = clearCookie;
