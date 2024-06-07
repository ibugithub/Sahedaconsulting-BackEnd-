import {Request, Response} from 'express'; 
import { showWorkFeature } from '../features/findWorkFeature';

export const showWorkController = (req: Request, res: Response) => {
  showWorkFeature(req, res);
}