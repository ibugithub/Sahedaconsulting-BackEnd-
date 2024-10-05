"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailF = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMailF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('the request body is', req.body);
    const { formData, type, frontEndDomain } = req.body;
    const gmailAccount = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_PASSWORD;
    const admin = 'outsideworkibrahim@gmail.com';
    const connectMsg = `A ${formData.serviceAs} ${formData.firstName} ${formData.lastName} want to connect.  ${JSON.stringify(formData.description)}. ${formData.firstName}'s Email is: ${formData.email}`;
    const transporter = nodemailer_1.default.createTransport({
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
    }
    else if (type === 'emailVerification') {
        const secret = process.env.JWT_SECRET || '';
        const verificationToken = jsonwebtoken_1.default.sign({ email: formData.email }, secret, { expiresIn: '1h' });
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
});
exports.sendMailF = sendMailF;
