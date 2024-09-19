import { Request, Response } from "express";
import { Service } from "../models/ServiceModel";
import { Proposals } from "../models/ProposalsModel";
import { Freelancer, User} from "../models/User";
import { isAlreadyApplied } from "../Utils/proposals";
import { Notification } from "../models/notification";
import { checkAuthentication } from "../Utils/auth";
import { ObjectId } from "mongodb";
import { UserInterface, ProposalInterface } from "../interface";

export const showWorksFeature = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isHiringClosed: {$ne: true}}).sort({ createdAt: -1 });
    return res.status(200).json({ message: 'this is the service', services });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}

export const showWorkFeature = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const service = await Service.findById(id);
    return res.status(200).json({ message: 'this is the service', service });
  } catch (error) {
    console.error('Could not find the service at findWorkFeatures.ts', error);
    return res.status(404).json({ message: 'Could not find the service at findWorkFeatures.ts' });
  }
}

const addNotification = async (user: UserInterface, message: string,  id: ObjectId) => {
  const newNotification = new Notification({
    user: user,
    message: message,
    type: 'proposal',
    typeId: id,
  });
  await newNotification.save();
}

export const addProposalF = async (req: Request, res: Response, user: UserInterface, proposalData: ProposalInterface) => {
  try {
    const freelancer = await Freelancer.findOne({ 'user': user._id }).populate('user')
    const service = await Service.findById(proposalData.service)
    const freelanceUser = await User.findById(user._id)
    
    if (!freelancer || !service || !freelanceUser) {
      console.error('Freelancer or service not found');
      return res.status(404).json({ message: 'Freelancer or service not found' });
    }
    
    const existingProposal = await isAlreadyApplied(freelancer._id as ObjectId, service._id as ObjectId);
    if (existingProposal) {
      console.error('You already have a proposal for this service');
      return res.status(400).json({ message: 'You already have a proposal for this service' });
    }

    const newProposal = new Proposals({
      freelancer: freelancer,
      service: proposalData.service,
      coverLetter: proposalData.coverLetter,
      price: proposalData.price,
    });

    // freelancer.proposals.push(newProposal._id as ObjectId);
    // service.proposals.push(newProposal._id as ObjectId);
    // service.proposalsCount = (service.proposalsCount ?? 0) + 1;
    // service.appliedFreelancers.push(freelancer._id as ObjectId);
    // await newProposal.save();
    // await freelancer.save();
    // await service.save();

    const adminUser = await User.findById(service.adminUser);
    if (!adminUser) {
      console.error('Admin user not found at freelancerFeatures.ts');
      return res.status(404).json({ message: 'Admin user not found at freelancerFeatures.ts' });
    }
    const message = `A proposal has been sent for ${service.title} by ${freelanceUser.firstName} ${freelanceUser.lastName}`;
    await addNotification(adminUser, message, newProposal._id as ObjectId);
    const io = req.app.get('socketio');
    io.emit('notification',{message: 'hello world'});
  }
  catch (error) {
    console.error('Error while creating proposal', error);
    return res.status(500).json({ message: 'Error while creating proposal', error: error });
  }
  return res.status(200).json({ message: 'Proposal created successfully' });
}

export const isAppliedF = async (req: Request, res: Response) => {
  const user = await checkAuthentication(req, res);
  if (user?.role !== 'freelancer') {
    return res.status(403).json({ message: 'Not a freelancer' });
  }
  const freelancer = await Freelancer.findOne({ 'user': user._id }).populate('user');
  const serviceId = req.body.service;
  if (!freelancer) {
    console.error('Freelancer or service not found');
    return res.status(404).json({ message: 'Freelancer or service not found' });
  }
  const alreadyApplied = await isAlreadyApplied(freelancer._id as ObjectId, serviceId as ObjectId);
  if (alreadyApplied) {
    return res.status(200).json({ message: 'applied', isApplied: true });
  }
  return res.status(200).json({ message: 'not applied', isApplied: false });
}