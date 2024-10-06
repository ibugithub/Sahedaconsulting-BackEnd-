import express from "express";
import { showWorksController, showSingleWorkController, addProposalC, isAlreadyAppliedC, showFreelancerOffersC, showFreelancerProposalsC, showFreelancerProposalDetailsC } from "../controllers/freelancerController";

const router = express.Router();

router.get('/showWorks', showWorksController);
router.get('/showsingleWork/:id', showSingleWorkController);
router.post('/addProposal', addProposalC);
router.post('/isApplied', isAlreadyAppliedC);
router.get('/showProposals', showFreelancerProposalsC);
router.get('/showOffers', showFreelancerOffersC);
router.get('/showProposalDetails/:id', showFreelancerProposalDetailsC);

export default router;