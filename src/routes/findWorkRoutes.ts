import express from "express";
import { showWorksController, showSingleWorkController, addProposalC } from "../controllers/findWorkController";

const router = express.Router();

router.get('/showWorks', showWorksController);
router.get('/showsingleWork/:id', showSingleWorkController);
router.post('/addProposal', addProposalC);

export default router;