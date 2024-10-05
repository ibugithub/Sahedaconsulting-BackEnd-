"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const freelancerController_1 = require("../controllers/freelancerController");
const router = express_1.default.Router();
router.get('/showWorks', freelancerController_1.showWorksController);
router.get('/showsingleWork/:id', freelancerController_1.showSingleWorkController);
router.post('/addProposal', freelancerController_1.addProposalC);
router.post('/isApplied', freelancerController_1.isAlreadyAppliedC);
router.get('/showProposals', freelancerController_1.showFreelancerProposalsC);
router.get('/showOffers', freelancerController_1.showFreelancerOffersC);
exports.default = router;
