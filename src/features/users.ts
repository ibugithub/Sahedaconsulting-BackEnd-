import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import '../../dotenv'
import { generateAccessToken } from '../Utils/jwtUtils';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || "";

export const refreshTokenF = (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decodeToken = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload
    const accessToken = generateAccessToken({ userId: decodeToken.userId, email: decodeToken.email })
    return res.status(200).json({ message: 'New Access Token has been created', accessToken: accessToken })
  } catch (err) {
    console.error("error in generating Accesstoken at 'refreshTokenF' at users.ts ", err);
    return res.status(403).json({ message: 'Invalid refresh  token' })
  }
}

export const sendProfileDataF = async (req: Request, res: Response) => {
  const accessToken = req.body.accessToken
  const parsedAccessToken = JSON.parse(accessToken)
  try {
    const decodedToken = jwt.verify(parsedAccessToken, JWT_SECRET) as JwtPayload
    const id = decodedToken.userId
    try {
      const user = await User.findById(id)
      const data = { 'fullName': `${user?.firstName} ${user?.lastName}`, 'email': user?.email }
      return res.status(200).json({ message: 'successfully sent the profile data', userInfo: data });
    } catch (e) {
      console.error('error while querying for user', e)
      return res.status(401).json({ message: 'error while querying for user', error: e });
    }
  } catch (err) {
    console.error('error while verifing accessToken', err)
    return res.status(401).json({ message: 'error while verifing accessToken', error: err });
  }
}