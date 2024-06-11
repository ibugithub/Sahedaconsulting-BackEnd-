import { Request, Response } from 'express';
import { serviceUploadS, showServiceS, updateServiceS, deleteServiceS, trashServiceF } from "../features/service"
import { sendMailF } from '../features/sendMail';
import { isAdministrator } from '../Utils/auth';

export const serviceUploadC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    serviceUploadS(req, res);
  } catch (err) { 
    console.error('error while checking if user is an administrator at users.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', err});
  }

}

export const showServiceC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    showServiceS(req, res);
  } catch (err) { 
    console.error('error while checking if user is an administrator at users.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', err});
  }
}

export const updateServiceC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    updateServiceS(req, res);
  } catch (err) { 
    console.error('error while checking if user is an administrator at users.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', err});
  }
}

export const deleteServiceC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    deleteServiceS(req, res);
  } catch (err) { 
    console.error('error while checking if user is an administrator at users.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', err});
  }
}

export const trashServiceC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    trashServiceF(req, res);
  } catch (err) { 
    console.error('error while checking if user is an administrator at users.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', err});
  }
}

export const sendMailC = (req: Request, res: Response) => {
  sendMailF(req, res);
}