import express from "express";
import { sendMailC } from "../controllers/buyerController";

const router = express.Router();

router.post('/sendMail', sendMailC);

export default router;