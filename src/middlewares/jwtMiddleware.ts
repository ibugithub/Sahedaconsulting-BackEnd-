import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import '../../dotenv'

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  } 
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    console.error('Error verifying token', error);
    return res.status(403).json({ error: 'Error verifying token' });
  }
};
