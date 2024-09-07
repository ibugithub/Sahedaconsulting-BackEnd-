import { Request, Response } from 'express';
import { clearCookie } from '../Utils/clearCookie';
import { registerF, loginF, refreshTokenF, sendProfileDataF, setImageF, saveUserDataF, changePasswordF } from '../features/usersFeautres';
import { checkAuthentication, checkAdministratorForFrontend, checkAuthenticationForFrontend } from '../Utils/auth';
import { verifyEmailF } from '../features/verifyEmail';

export const register = async (req: Request, res: Response) => {
  registerF(req, res);
}

export const login = async (req: Request, res: Response) => {
  loginF(req, res);
};

export const logout = (req: Request, res: Response) => {
  clearCookie(res, 'refreshToken');
}

export const isAuthenticatedC = (req: Request, res: Response) => {
  checkAuthenticationForFrontend(req, res);
}

export const isAdministratorC = (req: Request, res: Response) => {
  checkAdministratorForFrontend(req, res);
}

export const refreshToken = (req: Request, res: Response) => {
  refreshTokenF(req, res);
}

export const sendProfileDataC = async (req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (!user) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  sendProfileDataF(req, res, user);
};

export const setImageC = async (req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (!user) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  setImageF(req, res, user);
};

export const saveUserDataC = async (req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (!user) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  req.body.user = user;
  saveUserDataF(req, res);
};

export const changePasswordC = async (req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (!user) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  req.body.user = user;
  changePasswordF(req, res);
}

export const verifyEmailC = async (req: Request, res: Response) => {
  verifyEmailF(req, res);
}