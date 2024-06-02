import { Request, Response } from 'express';
import { serviceUploadS, showServiceS, updateServiceS, deleteServiceS } from "../features/service"
import { sendMailF } from '../features/sendMail';

export const serviceUploadC = (req: Request, res: Response) => {
  serviceUploadS(req, res);
}

export const showServiceC = ( req: Request, res: Response) => { 
  showServiceS(req, res);
}

export const updateServiceC = (req: Request, res: Response) => {
  updateServiceS(req, res);
}

export const deleteServiceC = (req: Request, res: Response) => {
  deleteServiceS(req, res);
}

export const sendMailC = (req: Request, res: Response) => { 
  sendMailF(req, res);
}