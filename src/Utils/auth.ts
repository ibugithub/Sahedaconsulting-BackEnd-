
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "";
import { User } from '../models/User';

const tokenToId = (token: string): string | null => {
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