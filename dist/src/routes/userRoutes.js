"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const adminRoutes_1 = require("./adminRoutes");
const router = express_1.default.Router();
router.post('/register', userController_1.register);
router.post('/login', userController_1.login);
router.post('/logout', userController_1.logout);
router.post('/refresh', userController_1.refreshToken);
router.post('/profile', userController_1.sendProfileDataC);
router.post('/setImage', adminRoutes_1.upload.single('image'), userController_1.setImageC);
router.post('/saveUserData', userController_1.saveUserDataC);
router.get('/isAuthenticated', userController_1.isAuthenticatedC);
router.get('/isAdministrator', userController_1.isAdministratorC);
router.post('/changePassword', userController_1.changePasswordC);
router.post('/verifyEmail', userController_1.verifyEmailC);
router.get('/getLoggedInUser', userController_1.getLoggedInUserC);
router.get('/showNotifications', userController_1.showNotificationsC);
router.put('/markNotificationAsRead/:notificationId', userController_1.markNotificationAsReadC);
router.delete('/deleteNotification/:notificationId', userController_1.deleteNotificationC);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map