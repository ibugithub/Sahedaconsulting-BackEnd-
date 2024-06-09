import { Request, Response } from "express";
import { Service } from "../models/ServiceModel";
import { Proposals } from "../models/ProposalsModel";
import { User, Freelancer, } from "../models/User";

export const showWorksFeature = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
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
    const newProposal = new Proposals({
      freelancer: freelancer?.user,
      service: proposalData.service,
      coverLetter: proposalData.coverLetter,
      price: proposalData.price,
    })
    console.log('the newProposals is', newProposal);
    if (!freelancer || !service) {
      console.error('Freelancer or service not found');
      return res.status(404).json({ message: 'Freelancer or service not found' });
    }
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