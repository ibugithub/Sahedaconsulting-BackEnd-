import express from 'express';
import { register, login, logout, refreshToken, sendProfileDataC, setImageC, saveUserDataC} from '../controllers/userController';
import { upload } from './service';


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/profile', sendProfileDataC)
router.post('/setImage', upload.single('image'), setImageC);
router.post('/saveUserData', saveUserDataC);

export default router;
