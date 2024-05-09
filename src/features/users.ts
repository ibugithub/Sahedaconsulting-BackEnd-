import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import '../../dotenv'
import { generateAccessToken } from '../Utils/jwtUtils';

const JWT_SECRET = process.env.JWT_SECRET || "";

export const refreshTokenF = (req:Request, res:Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decodeToken = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload
    const accessToken = generateAccessToken({usereId: decodeToken.userId, email: decodeToken.email})
    return res.status(200).json({message: 'New Access Token has been created', accessToken: accessToken})
  } catch (err) {
    console.error("error in generating Accesstoken at 'refreshTokenF' at users.ts ", err);
    return res.status(403).json({ message: 'Invalid refresh  token' })
  }
}