import express from "express";
import { showWorksController, showSingleWorkController } from "../controllers/findWorkController";

const router = express.Router();

router.get('/showWorks', showWorksController);
router.get('/showsingleWork/:id', showSingleWorkController);

export default router;