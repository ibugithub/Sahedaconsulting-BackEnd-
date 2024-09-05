import { Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const verifyEmailF = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (token) {
    const secret = process.env.JWT_SECRET || '';
    try {
      const decoded = jwt.verify(token as string, secret);
      const email  = (decoded as any).email;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.isVerified = true;
      await user.save();
      return res.status(201).json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Error verifying email:', error);
      return res.status(500).json({ message: 'Error verifying email' });
    }
  } else {
    return res.status(400).json({ message: 'No token provided' });
  }
}