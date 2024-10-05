"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMiddleWare = (req, res, next) => {
    const startTime = new Date().getTime();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.on('finish', () => {
        const endTime = new Date().getTime();
        console.log(`[${new Date().toISOString()}], Response: ${res.statusCode}, Time Taken: ${endTime - startTime}ms`);
    });
    next();
};
exports.default = loggerMiddleWare;
