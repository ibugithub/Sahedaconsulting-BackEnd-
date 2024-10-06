import { Request, Response } from 'express';
import { showWorksFeature, showWorkFeature, addProposalF, isAppliedF, showFreelancerOffersF, showFreelancerProposalsF, showFreelancerProposalDetailsF } from '../features/freelancerFeatures';
import { checkAuthentication } from '../Utils/auth';

export const showWorksController = (req: Request, res: Response) => {
  showWorksFeature(req, res);
}

export const showSingleWorkController = (req: Request, res: Response) => {
  showWorkFeature(req, res);
}

export const addProposalC = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    if (user.isVerified !== true) {
      console.error('User not verified');
      return res.status(401).json({ message: 'User not verified' });
    }
    const proposalData = req.body;
    addProposalF(req, res, user, proposalData);
  } catch (error) {
    console.error('Error while checking authentication in addProposal at freelancerController.ts', error);
    return res.status(401).json({ message: 'User not authenticated' });
  }
}

export const isAlreadyAppliedC = (req: Request, res: Response) => {
  isAppliedF(req, res);
}

export const showFreelancerOffersC = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    showFreelancerOffersF(req, res, user);
  }
  catch (err) {
    console.error("error while fetching offers in showFreelancerOffers at freelancerController.ts", err);
    return res.status(500).json({ message: 'error while fetching offers in showFreelancerOffers at freelancerController.ts' });
  }
};

export const showFreelancerProposalsC = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    showFreelancerProposalsF(req, res, user);
  }
  catch (err) {
    console.error("error while fetching offers in showFreelancerOffers at freelancerController.ts", err);
    return res.status(500).json({ message: 'error while fetching offers in showFreelancerOffers at freelancerController.ts' });
  }
};


export const showFreelancerProposalDetailsC = async (req: Request, res: Response) => {
  try {
    const user = await checkAuthentication(req, res);
    const id = req.params.id;
    showFreelancerProposalDetailsF(req, res, user, id);
  }
  catch (err) {
    console.error("error while fetching offers in showFreelancerOffers at freelancerController.ts", err);
    return res.status(500).json({ message: 'error while fetching offers in showFreelancerOffers at freelancerController.ts' });
  }
};