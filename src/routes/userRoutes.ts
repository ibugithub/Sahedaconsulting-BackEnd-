import express from 'express';
import { register, login, logout, refreshToken, sendProfileDataC, setImageC, saveUserDataC, isAuthenticatedC, isAdministratorC, changePasswordC, verifyEmailC, getLoggedInUserC, showNotificationsC, markNotificationAsReadC, deleteNotificationC} from '../controllers/userController';
import { upload } from './adminRoutes';


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/profile', sendProfileDataC);
router.post('/setImage', upload.single('image'), setImageC);
router.post('/saveUserData', saveUserDataC);
router.get('/isAuthenticated', isAuthenticatedC);
router.get('/isAdministrator', isAdministratorC);
router.post('/changePassword', changePasswordC);
router.post('/verifyEmail', verifyEmailC);
router.get('/getLoggedInUser', getLoggedInUserC);
router.get('/showNotifications', showNotificationsC);
router .put('/markNotificationAsRead/:notificationId', markNotificationAsReadC);
router.delete('/deleteNotification/:notificationId', deleteNotificationC);

export default router;
