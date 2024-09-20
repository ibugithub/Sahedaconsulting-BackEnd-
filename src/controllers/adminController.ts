import { Request, Response } from 'express';
import { serviceUploadS, showServiceS, updateServiceS, deleteServiceS, markCompletedF, showHiredServiceF, showCompletedServiceF, markHiredF, showServiceDetailsF, hireFreelancerF, showUsersF, sendFreelancerDetailsF, sendFreelancerProposalsF, changeUserRoleF, addNewUsersF, deleteUserF, showSecretCodesF, createSecretCodeF, deleteSecretCodeF } from "../features/adminFeatures"
import { checkAdministrator } from '../Utils/auth';
import { Proposals } from '../models/ProposalsModel';



export const serviceUploadC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  serviceUploadS(req, res, adminUser);
}

export const showServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  showServiceS(req, res);
}

export const updateServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  updateServiceS(req, res);
}

export const deleteServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  try {
    const serviceId = req.params.id;
    const proposal = await Proposals.findOne({ 'service': serviceId, status: 'accepted' });
    if (proposal) {
      return res.status(400).json({ error: 'Service is already hired so you can not delete it', customCode: 17 });
    }
  } catch (err) {
    console.error('error while getting serviceId and proposal at adminController.ts', err);
    return res.status(401).json({ message: 'error while getting serviceId and proposal at adminController.ts', err });
  }
  deleteServiceS(req, res);
}

export const markCompletedC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  markCompletedF(req, res);
}

export const markHiredC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  markHiredF(req, res);
}

export const showHiredServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  showHiredServiceF(req, res);
}

export const showCompletedServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  showCompletedServiceF(req, res);
}

export const showServiceDetailsC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  showServiceDetailsF(req, res);
}

export const hireFreelancerC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  hireFreelancerF(req, res);
}

export const showUsersC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  return showUsersF(req, res);
}

export const sendFreelancerDetailsC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  return sendFreelancerDetailsF(req, res);
}

export const sendFreelancerProposalsC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  return sendFreelancerProposalsF(req, res);
}

export const changeUserRoleC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  const newRole = req.body.role;
  const userId = req.body.user;
  return changeUserRoleF(req, res, userId, newRole);
}

export const addNewUsersC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  return addNewUsersF(req, res);
}

export const deleteUserC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  const id = req.params.id;
  return deleteUserF(req, res, id);
}

export const showSecretCodesC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  return showSecretCodesF(req, res);
}

export const deleteSecretCodeC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  const id = req.params.id;
  return deleteSecretCodeF(req, res, id);
}

export const createSecretCodeC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('error while checking if user is an administrator at adminController.ts');
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
  }
  return createSecretCodeF(req, res);
}