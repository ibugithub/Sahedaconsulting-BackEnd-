import {Request, Response} from 'express'; 
import { showWorksFeature, showWorkFeature, addProposalF, isAppliedF} from '../features/freelancerFeatures';
import { checkAuthentication } from '../Utils/auth';

export const showWorksController = (req: Request, res: Response) => {
  showWorksFeature(req, res);
}

export const showSingleWorkController = (req: Request, res: Response) => {
  showWorkFeature(req, res);
}

export const addProposalC = async(req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (!user) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  if (user.isVerified !== true) {
    console.error('User not verified');
    return res.status(401).json({ message: 'User not verified' });
  }
  const proposalData = req.body;
  addProposalF(req, res, user, proposalData);
}

export const isAlreadyAppliedC = (req: Request, res: Response) => {
  isAppliedF(req, res);
}