import express from 'express';
import { register, login, logout, refreshToken, sendProfileDataC, setImageC, saveUserDataC, isAuthenticatedC, isAdministratorC} from '../controllers/userController';
import { upload } from './admin';


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


export default router;
