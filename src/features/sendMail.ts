import { Request, Response } from 'express'
import nodemailer from 'nodemailer';


export const sendMailF = async (req: Request, res: Response) => {
  const formData = req.body;
  const gmailAccount = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_PASSWORD;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailAccount,
      pass: gmailPassword
    }
  });
  const mailOptions = {
    from: gmailAccount,
    to: 'ibrahimibu681@gmail.com',
    subject: `Need attention! A ${formData.serviceAs} want to get some work done`,
    text: `A ${formData.serviceAs} ${formData.firstName} ${formData.lastName} want to connect.  ${JSON.stringify(formData.description)}`
  };

  transporter.sendMail(mailOptions, (error, info) =>{
    if(error) {
      console.log('the error is ', error);
      return res.status(500).send(error.toString());
    }
    return res.status(200).send('Email sent: ' + info.response);
  });
}
