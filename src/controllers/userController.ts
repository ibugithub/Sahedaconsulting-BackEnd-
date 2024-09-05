import { Request, Response } from 'express';
import { clearCookie } from '../Utils/clearCookie';
import { registerF, loginF, refreshTokenF, sendProfileDataF, setImageF, saveUserDataF,isAuthenticatedF, isAdministratorF, changePasswordF} from '../features/usersFeautres';
import { isAuthenticated } from '../Utils/auth'; 
import { verifyEmailF } from '../features/verifyEmail';

export const checkAuthentication = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  if (typeof accessToken !== 'string') {
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string' });
  } 
  try {
    const user = await isAuthenticated(accessToken);
    if (!user) {
      console.error('Could not find user at user.ts');
      return res.status(401).json({ message: 'user not found' });
    }
    return user;
  } catch (err) {
    console.error("Error while changing password at userFeatures.ts", err);
  }
}
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
  isAuthenticatedF(req, res);
}

export const isAdministratorC = (req: Request, res: Response) => {
  isAdministratorF(req, res);
}

export const refreshToken = (req: Request, res: Response) => {
  refreshTokenF(req, res);
}

export const sendProfileDataC = (req: Request, res: Response) => {
  sendProfileDataF(req, res);
};

export const setImageC = (req: Request, res: Response) => {
  setImageF(req, res);
};

export const saveUserDataC = async(req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (user) {
    req.body.user = user;
    saveUserDataF(req, res);
  }
};

export const changePasswordC = async(req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (user) {
    req.body.user = user;
    return changePasswordF(req, res);
  }
}

export const verifyEmailC = async(req: Request, res: Response) => {
  verifyEmailF(req, res);
}