import { Request, Response } from 'express';
import { clearCookie } from '../Utils/clearCookie';
import { registerF, loginF, refreshTokenF, sendProfileDataF, setImageF, saveUserDataF, changePasswordF } from '../features/usersFeautres';
import { checkAuthentication, checkAdministratorForFrontend, checkAuthenticationForFrontend } from '../Utils/auth';
import { verifyEmailF } from '../features/verifyEmail';
import { Notification } from '../models/notification';

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

export const getLoggedInUserC = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    return res.status(201).json({ user });
  } catch (error: any) {
    console.error('Error while getting logged in user at userController.ts', error);
    return res.status(200).json({});
  }
}

export const showNotificationsC = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    if (user) {
      const notifications = await Notification.find({ user: user._id });
      return res.status(200).json({ user: 'authenticatedUser', notifications: notifications });
    }
  }
  catch (error) {
    console.log("Error while getting notifications by it's id at userController.ts", error);
    return res.status(200).json({ user: 'unAuthenticated user', notifications: [] });
  }
}

export const markNotificationAsReadC = async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId);
  if (notification) {
    notification.isRead = true;
    await notification.save();
    return res.status(200).json({ message: 'Notification marked as read' });
  }
  return res.status(404).json({ message: 'Notification not found at markNotificationAsReadC at userController.ts' });
}

export const deleteNotificationC = async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId);
  if (notification) {
    await Notification.findByIdAndDelete(notificationId);
    return res.status(200).json({ message: 'Notification deleted' });
  }
  return res.status(404).json({ message: 'Notification not found at deleteNotificationC at userController.ts' });
}