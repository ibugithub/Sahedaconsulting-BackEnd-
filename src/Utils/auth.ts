
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "";
import { User } from '../models/User';
import { Request, Response } from 'express';

export const tokenToId = (token: string): string | null => {
  const parsedAccessToken = JSON.parse(token)
  try {
    const decodedToken = jwt.verify(parsedAccessToken, JWT_SECRET) as JwtPayload
    return decodedToken.userId
  } catch (err) {
    console.error('error while verifing accessToken', err)
    return null
  }
}

export const isAuthenticated = async (accessToken: string) => {
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

export const isAdministrator = async (accessToken: string) => {
  const user = await isAuthenticated(accessToken)
  if (user.role !== 'administrator') {
    throw new Error('User is not an administrator');
  }
  return user
}

export const checkAuthentication = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.accesstoken as string;
    const user = await isAuthenticated(accessToken);
    return user;
  } catch (err: any) {
    console.error("Error while checking authentication at auth.ts", err);
  }
}

export const checkAdministrator = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.accesstoken as string;
    const user = await isAdministrator(accessToken);
    return user;
  } catch (err: any) {
    console.error("Error while checking administrator at auth.ts", err);
  }
}

export const checkAuthenticationForFrontend = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    const user = await isAuthenticated(accessToken);
    if (!user) {
      console.error('Could not find user at user.ts');
      return res.status(401).json({ message: 'user not found' });
    }
    return res.status(200).json({ message: 'User is authenticated', user });
  } catch (err) {
    console.error("Error while checking authentication at userFeatures.ts", err);
  }
}

export const checkAdministratorForFrontend = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    const user = await isAdministrator(accessToken);
    return res.status(200).json({ message: 'User is an administrator', user });
  } catch (e: any) {
    console.error('error while checking if user is an administrator at users.ts', e.message);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', error: e.message });
  }
}