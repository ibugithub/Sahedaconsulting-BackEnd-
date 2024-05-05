import express from 'express';
import { register, login, logout, refreshToken} from '../controllers/userController';
import { authenticateToken} from '../middlewares/jwtMiddleware';


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;
