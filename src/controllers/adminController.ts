import { Request, Response } from 'express';
import { serviceUploadS, showServiceS, updateServiceS, deleteServiceS, markCompletedF, showHiredServiceF, showCompletedServiceF, markHiredF, showServiceDetailsF, hireFreelancerF, showUsersF, sendFreelancerDetailsF, sendFreelancerProposalsF, changeUserRoleF, addNewUsersF, deleteUserF, showSecretCodesF, createSecretCodeF, deleteSecretCodeF } from "../features/adminFeatures"
import { checkAdministrator } from '../Utils/auth';
import { Proposals } from '../models/ProposalsModel';


export const serviceUploadC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('User is not an administrator');
    return res.status(401).json({ message: 'User is not an administrator' });
  }
  serviceUploadS(req, res, adminUser);
}

export const showServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('User is not an administrator');
    return res.status(401).json({ message: 'User is not an administrator' });
  }
  showServiceS(req, res);
}

export const updateServiceC = async (req: Request, res: Response) => {
  const adminUser = await checkAdministrator(req, res);
  if (!adminUser) {
    console.error('User is not an administrator');
    return res.status(401).json({ message: 'User is not an administrator' });
  }
  updateServiceS(req, res);
}

export const deleteServiceC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    const serviceId = req.params.id;
    const proposal = await Proposals.findOne({ 'service': serviceId, status: 'accepted' });
    if (proposal) {
      return res.status(400).json({ error: 'Service is already hired so you can not delete it', customCode: 17 });
    }
    deleteServiceS(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const markCompletedC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    markCompletedF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const markHiredC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    markHiredF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showHiredServiceC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    showHiredServiceF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showCompletedServiceC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    showCompletedServiceF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showServiceDetailsC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    showServiceDetailsF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const hireFreelancerC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    hireFreelancerF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showUsersC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    return showUsersF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const sendFreelancerDetailsC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    return sendFreelancerDetailsF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const sendFreelancerProposalsC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    return sendFreelancerProposalsF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const changeUserRoleC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
    const newRole = req.body.role;
    const userId = req.body.user;
    return changeUserRoleF(req, res, userId, newRole);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const addNewUsersC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
  return addNewUsersF(req, res);
}

export const deleteUserC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
  const id = req.params.id;
  return deleteUserF(req, res, id);
}

export const showSecretCodesC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
  return showSecretCodesF(req, res);
}

export const deleteSecretCodeC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
  const id = req.params.id;
  return deleteSecretCodeF(req, res, id);
}

export const createSecretCodeC = async (req: Request, res: Response) => {
  try {
    await checkAdministrator(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
  return createSecretCodeF(req, res);
}