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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotificationC = exports.markNotificationAsReadC = exports.showNotificationsC = exports.getLoggedInUserC = exports.verifyEmailC = exports.changePasswordC = exports.saveUserDataC = exports.setImageC = exports.sendProfileDataC = exports.refreshToken = exports.isAdministratorC = exports.isAuthenticatedC = exports.logout = exports.login = exports.register = void 0;
const clearCookie_1 = require("../Utils/clearCookie");
const usersFeautres_1 = require("../features/usersFeautres");
const auth_1 = require("../Utils/auth");
const verifyEmail_1 = require("../features/verifyEmail");
const notification_1 = require("../models/notification");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, usersFeautres_1.registerF)(req, res);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, usersFeautres_1.loginF)(req, res);
});
exports.login = login;
const logout = (req, res) => {
    (0, clearCookie_1.clearCookie)(res, 'refreshToken');
};
exports.logout = logout;
const isAuthenticatedC = (req, res) => {
    (0, auth_1.checkAuthenticationForFrontend)(req, res);
};
exports.isAuthenticatedC = isAuthenticatedC;
const isAdministratorC = (req, res) => {
    (0, auth_1.checkAdministratorForFrontend)(req, res);
};
exports.isAdministratorC = isAdministratorC;
const refreshToken = (req, res) => {
    (0, usersFeautres_1.refreshTokenF)(req, res);
};
exports.refreshToken = refreshToken;
const sendProfileDataC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_1.checkAuthentication)(req, res);
    if (!user) {
        console.error('User not authenticated');
        return res.status(401).json({ message: 'User not authenticated' });
    }
    (0, usersFeautres_1.sendProfileDataF)(req, res, user);
});
exports.sendProfileDataC = sendProfileDataC;
const setImageC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_1.checkAuthentication)(req, res);
    if (!user) {
        console.error('User not authenticated');
        return res.status(401).json({ message: 'User not authenticated' });
    }
    (0, usersFeautres_1.setImageF)(req, res, user);
});
exports.setImageC = setImageC;
const saveUserDataC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_1.checkAuthentication)(req, res);
    if (!user) {
        console.error('User not authenticated');
        return res.status(401).json({ message: 'User not authenticated' });
    }
    req.body.user = user;
    (0, usersFeautres_1.saveUserDataF)(req, res);
});
exports.saveUserDataC = saveUserDataC;
const changePasswordC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_1.checkAuthentication)(req, res);
    if (!user) {
        console.error('User not authenticated');
        return res.status(401).json({ message: 'User not authenticated' });
    }
    req.body.user = user;
    (0, usersFeautres_1.changePasswordF)(req, res);
});
exports.changePasswordC = changePasswordC;
const verifyEmailC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, verifyEmail_1.verifyEmailF)(req, res);
});
exports.verifyEmailC = verifyEmailC;
const getLoggedInUserC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_1.checkAuthentication)(req, res);
        return res.status(201).json({ user });
    }
    catch (error) {
        console.error('Error while getting logged in user at userController.ts', error);
        return res.status(200).json({});
    }
});
exports.getLoggedInUserC = getLoggedInUserC;
const showNotificationsC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_1.checkAuthentication)(req, res);
        if (user) {
            const notifications = yield notification_1.Notification.find({ user: user._id });
            return res.status(200).json({ user: 'authenticatedUser', notifications: notifications });
        }
    }
    catch (error) {
        console.log("Error while getting notifications by it's id at userController.ts", error);
        return res.status(200).json({ user: 'unAuthenticated user', notifications: [] });
    }
});
exports.showNotificationsC = showNotificationsC;
const markNotificationAsReadC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationId } = req.params;
    const notification = yield notification_1.Notification.findById(notificationId);
    if (notification) {
        notification.isRead = true;
        yield notification.save();
        return res.status(200).json({ message: 'Notification marked as read' });
    }
    return res.status(404).json({ message: 'Notification not found at markNotificationAsReadC at userController.ts' });
});
exports.markNotificationAsReadC = markNotificationAsReadC;
const deleteNotificationC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationId } = req.params;
    const notification = yield notification_1.Notification.findById(notificationId);
    if (notification) {
        yield notification_1.Notification.findByIdAndDelete(notificationId);
        return res.status(200).json({ message: 'Notification deleted' });
    }
    return res.status(404).json({ message: 'Notification not found at deleteNotificationC at userController.ts' });
});
exports.deleteNotificationC = deleteNotificationC;
