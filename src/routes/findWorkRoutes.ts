import express from "express";
import { showWorkController } from "../controllers/findWorkController";

const router = express.Router();

router.get('/showWork', showWorkController);

export default router;