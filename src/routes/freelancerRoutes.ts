import express from "express";
import { showWorksController, showSingleWorkController, addProposalC, isAlreadyAppliedC } from "../controllers/freelancerController";

const router = express.Router();

router.get('/showWorks', showWorksController);
router.get('/showsingleWork/:id', showSingleWorkController);
router.post('/addProposal', addProposalC);
router.post('/isApplied', isAlreadyAppliedC);

export default router;