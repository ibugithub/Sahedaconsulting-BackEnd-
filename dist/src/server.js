"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const freelancerRoutes_1 = __importDefault(require("./routes/freelancerRoutes"));
const buyerRoutes_1 = __importDefault(require("./routes/buyerRoutes"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const database_1 = require("../config/database");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (_a = process.env.TRUSTED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(','),
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(loggerMiddleware_1.default);
(0, database_1.connectDb)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
    console.log("\n \n +++ uploadsdir has been created +++ \n \n");
}
else {
    console.log(' \n \n uploadsdir already exists!!! \n \n');
}
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/freelancer', freelancerRoutes_1.default);
app.use('/api/buyer', buyerRoutes_1.default);
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (_b = process.env.TRUSTED_ORIGINS) === null || _b === void 0 ? void 0 : _b.split(','),
        credentials: true,
    },
});
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
app.set('socketio', io);
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map