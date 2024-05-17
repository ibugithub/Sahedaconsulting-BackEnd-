import { Request, Response } from 'express';
import { clearCookie } from '../Utils/clearCookie';
import { registerF, loginF, refreshTokenF, sendProfileDataF, setImageF, saveUserDataF} from '../features/users';


export const register = async (req: Request, res: Response) => {
  registerF(req, res);
}

export const login = async (req: Request, res: Response) => {
  loginF(req, res);
};

export const logout = (req: Request, res: Response) => {
  clearCookie(res, 'refreshToken');
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

export const saveUserDataC = (req: Request, res: Response) => {
  saveUserDataF(req, res);
};