import {Request, Response} from 'express'; 
import { showWorksFeature, showWorkFeature } from '../features/findWorkFeature';

export const showWorksController = (req: Request, res: Response) => {
  showWorksFeature(req, res);
}

export const showSingleWorkController = (req: Request, res: Response) => {
  showWorkFeature(req, res);
}