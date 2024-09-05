import { Request, Response } from 'express'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const sendMailF = async (req: Request, res: Response) => {
  console.log('the request body is', req.body);
  const { formData, type, frontEndDomain } = req.body;
  const gmailAccount = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_PASSWORD;
  const admin = 'outsideworkibrahim@gmail.com';
  const connectMsg = `A ${formData.serviceAs} ${formData.firstName} ${formData.lastName} want to connect.  ${JSON.stringify(formData.description)}. ${formData.firstName}'s Email is: ${formData.email}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailAccount,
      pass: gmailPassword
    }
  });
  let mailOptions = {};
  if (type === 'contactForService') {
    mailOptions = {
      from: gmailAccount,
      to: admin,
      subject: `Need attention! A ${formData.serviceAs} want to get some work done`,
      text: connectMsg
    };
  } else if (type === 'emailVerification') {
    const secret = process.env.JWT_SECRET || '';
    const verificationToken = jwt.sign(
      { email: formData.email },
      secret,
      { expiresIn: '1h' }
    );
    const domain = frontEndDomain;
    const verificationLink = `${domain}/verifyEmail?token=${verificationToken}`;
    const emailVerificationMsg = `Hello, ${formData.firstName} ${formData.lastName}! Please verify your email by clicking the link: ${verificationLink}`;
    
    mailOptions = {
      from: gmailAccount,
      to: formData.email,
      subject: `Please verify email in your Sahedaconsulting account!`,
      text: emailVerificationMsg
    };
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('the error is ', error);
      return res.status(500).send(error.toString());
    }
    return res.status(200).send('Email sent: ' + info.response);
  });
}
