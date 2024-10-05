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
Object.defineProperty(exports, "__esModule", { value: true });
exports.showFreelancerProposalsC = exports.showFreelancerOffersC = exports.isAlreadyAppliedC = exports.addProposalC = exports.showSingleWorkController = exports.showWorksController = void 0;
const freelancerFeatures_1 = require("../features/freelancerFeatures");
const auth_1 = require("../Utils/auth");
const showWorksController = (req, res) => {
    (0, freelancerFeatures_1.showWorksFeature)(req, res);
};
exports.showWorksController = showWorksController;
const showSingleWorkController = (req, res) => {
    (0, freelancerFeatures_1.showWorkFeature)(req, res);
};
exports.showSingleWorkController = showSingleWorkController;
const addProposalC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_1.checkAuthentication)(req, res);
        if (user.isVerified !== true) {
            console.error('User not verified');
            return res.status(401).json({ message: 'User not verified' });
        }
        const proposalData = req.body;
        (0, freelancerFeatures_1.addProposalF)(req, res, user, proposalData);
    }
    catch (error) {
        console.error('Error while checking authentication in addProposal at freelancerController.ts', error);
        return res.status(401).json({ message: 'User not authenticated' });
    }
});
exports.addProposalC = addProposalC;
const isAlreadyAppliedC = (req, res) => {
    (0, freelancerFeatures_1.isAppliedF)(req, res);
};
exports.isAlreadyAppliedC = isAlreadyAppliedC;
const showFreelancerOffersC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_1.checkAuthentication)(req, res);
        (0, freelancerFeatures_1.showFreelancerOffersF)(req, res, user);
    }
    catch (err) {
        console.error("error while fetching offers in showFreelancerOffers at freelancerController.ts", err);
        return res.status(500).json({ message: 'error while fetching offers in showFreelancerOffers at freelancerController.ts' });
    }
});
exports.showFreelancerOffersC = showFreelancerOffersC;
const showFreelancerProposalsC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_1.checkAuthentication)(req, res);
        (0, freelancerFeatures_1.showFreelancerProposalsF)(req, res, user);
    }
    catch (err) {
        console.error("error while fetching offers in showFreelancerOffers at freelancerController.ts", err);
        return res.status(500).json({ message: 'error while fetching offers in showFreelancerOffers at freelancerController.ts' });
    }
});
exports.showFreelancerProposalsC = showFreelancerProposalsC;
