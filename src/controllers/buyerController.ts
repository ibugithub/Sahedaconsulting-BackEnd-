import { sendMailF } from "../features/sendMail";
import { Request, Response } from 'express';

export const sendMailC = (req: Request, res: Response) => {
  sendMailF(req, res);
}