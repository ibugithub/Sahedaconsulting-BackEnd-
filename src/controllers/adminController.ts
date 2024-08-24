import { Request, Response } from 'express';
import { serviceUploadS, showServiceS, updateServiceS, deleteServiceS, markCompletedF, showHiredServiceF, showCompletedServiceF, markHiredF, showServiceDetailsF, hireFreelancerF, showUsersF, sendFreelancerDetailsF, sendFreelancerProposalsF} from "../features/adminFeatures"
import { isAdministrator } from '../Utils/auth';
import { Proposals } from '../models/ProposalsModel';

export const serviceUploadC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    serviceUploadS(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }

}

export const showServiceC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    showServiceS(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const updateServiceC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    updateServiceS(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const deleteServiceC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
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
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    markCompletedF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const markHiredC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    markHiredF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showHiredServiceC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    showHiredServiceF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showCompletedServiceC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    showCompletedServiceF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showServiceDetailsC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    showServiceDetailsF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const hireFreelancerC = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    hireFreelancerF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const showUsersC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    return showUsersF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const sendFreelancerDetailsC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    return sendFreelancerDetailsF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}

export const sendFreelancerProposalsC = async(req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken as string;
  try {
    await isAdministrator(accessToken);
    return sendFreelancerProposalsF(req, res);
  } catch (err) {
    console.error('error while checking if user is an administrator at adminController.ts', err);
    return res.status(401).json({ message: 'Error while checking admin user at adminController.ts', err });
  }
}