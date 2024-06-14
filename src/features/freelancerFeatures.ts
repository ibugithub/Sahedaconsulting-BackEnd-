import { Request, Response } from "express";
import { Service } from "../models/ServiceModel";
import { Proposals } from "../models/ProposalsModel";
import { Freelancer, User } from "../models/User";
import { isAlreadyApplied } from "../Utils/proposals";

export const showWorksFeature = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({isTrashed: {$ne: true}}).sort({ createdAt: -1 });
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

export const addProposalF = async (req: Request, res: Response) => {
  const proposalData = req.body
  try {
    const freelancer = await Freelancer.findOne({ 'user': proposalData.userId }).populate('user')
    const service = await Service.findById(proposalData.service)
    
    if (!freelancer || !service) {
      console.error('Freelancer or service not found');
      return res.status(404).json({ message: 'Freelancer or service not found' });
    }

    const existingProposal = await isAlreadyApplied(freelancer._id, service._id);
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

    freelancer.proposals.push(newProposal._id);
    service.proposals.push(newProposal._id);
    service.proposalsCount = (service.proposalsCount ?? 0) + 1;
    service.appliedFreelancers.push(freelancer._id);
    await newProposal.save();
    await freelancer.save();
    await service.save();
  }
  catch (error) {
    console.error('Error while creating proposal', error);
    return res.status(500).json({ message: 'Error while creating proposal', error: error });
  }
  return res.status(200).json({ message: 'This is the proposal' });
}

export const isAppliedF = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const user = await User.findById(userId);
  if (user?.role !== 'freelancer') {
    return res.status(403).json({ message: 'Not a freelancer' });
  }
  const freelancer = await Freelancer.findOne({ 'user': userId }).populate('user');
  const serviceId = req.body.service;
  if (!freelancer) {
    console.error('Freelancer or service not found');
    return res.status(404).json({ message: 'Freelancer or service not found' });
  }
  const alreadyApplied = await isAlreadyApplied(freelancer._id, serviceId);
  if (alreadyApplied) {
    return res.status(200).json({ message: 'not applied', isApplied: true });
  }
  return res.status(200).json({ message: 'applied', isApplied: false });
}