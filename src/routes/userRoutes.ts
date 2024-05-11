import express from 'express';
import { register, login, logout, refreshToken, sendProfileDataC} from '../controllers/userController';


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/profile', sendProfileDataC)

export default router;
