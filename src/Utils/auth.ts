
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "";
import { User } from '../models/User';
import { Request, Response } from 'express';

export const tokenToId = (token: string): string | null => {
  try {
    const parsedAccessToken = JSON.parse(token)
    const decodedToken = jwt.verify(parsedAccessToken, JWT_SECRET) as JwtPayload
    return decodedToken.userId
  } catch (err) {
    console.error('error while parsing and verifing accessToken in tokenToId at auth.ts', err)
    return null
  }
}

export const checkAuthentication = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  const id = tokenToId(accessToken)
  if (!id) {
    throw new Error('Invalid access token');
  }
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user
}

export const checkAdministrator = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    if (user.role !== 'administrator') {
      throw new Error('User is not an administrator');
    }
    return user;
  } catch (err: any) {
    console.error("Error while checking administrator in checkAdministrator at auth.ts", err);
  }
}

export const checkAuthenticationForFrontend = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    return res.status(200).json({ message: 'User is authenticated', user });
  } catch (err) {
    console.error("Error while checking authentication at userFeatures.ts", err);
    return res.status(401).json({ message: 'Error while checking authentication in checkAuthentication at auth.ts', err });
  }
}

export const checkAdministratorForFrontend = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at auth.ts');
    return res.status(401).json({ message: 'Error while checking admin user at auth.ts' });
  }
  return res.status(200).json({ message: 'User is an administrator', adminUser });
} 
