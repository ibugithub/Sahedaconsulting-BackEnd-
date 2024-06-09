import {Request, Response} from 'express'; 
import { showWorksFeature, showWorkFeature, addProposalF } from '../features/findWorkFeature';

export const showWorksController = (req: Request, res: Response) => {
  showWorksFeature(req, res);
}

export const showSingleWorkController = (req: Request, res: Response) => {
  showWorkFeature(req, res);
}

export const addProposalC = (req: Request, res: Response) => {
  addProposalF(req, res);
}