import express from "express";
import { showWorksController, showSingleWorkController, addProposalC, isAlreadyAppliedC, showFreelancerOffersC, showFreelancerProposalsC } from "../controllers/freelancerController";

const router = express.Router();

router.get('/showWorks', showWorksController);
router.get('/showsingleWork/:id', showSingleWorkController);
router.post('/addProposal', addProposalC);
router.post('/isApplied', isAlreadyAppliedC);
router.get('/showProposals', showFreelancerProposalsC);
router.get('/showOffers', showFreelancerOffersC);

export default router;