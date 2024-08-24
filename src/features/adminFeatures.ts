import { Request, Response } from "express"
import { Service } from "../models/ServiceModel"
import { User } from "../models/User";
import { Freelancer } from "../models/User";
import { Proposals } from "../models/ProposalsModel";
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

export const serviceUploadS = async (req: Request, res: Response) => {
  let imagePath = "";
  let results = { public_id: "noImage" };
  if (req.file) {
    imagePath = (req.file as Express.Multer.File).path.replace(/\\/g, "/")
  }
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    if (imagePath) {
      results = await cloudinary.uploader.upload(imagePath, options);
    }
    const { service, description, price, requiredFreelancer } = req.body
    const newService = new Service({
      title: service,
      description: description,
      price: price,
      requiredFreelancers: requiredFreelancer,
      image: results.public_id
    })
    await newService.save()
    return res.status(200).json({ message: 'Service will be uploaded' })
  } catch (err) {
    console.error("Error while uploading image on cloudinary at service.ts", err);
  }
  finally {
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.log('Could not find the file at service.ts')
    }
  }
}

export const showServiceS = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isHiringClosed: { $ne: true } }).sort({ createdAt: -1 });
    return res.status(200).json({ message: 'this is the service', services });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}

export const updateServiceS = async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const { title, description, price, imgPath } = req.body;
  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  let newImagePath;

  if (req.file) {
    const newImage = (req.file as Express.Multer.File).path.replace(/\\/g, "/")
    const oldImage = imgPath
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    try {
      const results = await cloudinary.uploader.upload(newImage, options);
      newImagePath = results.public_id
    } catch (error) {
      console.error("Error while editing the image at service.ts", error);
    } finally {
      if (fs.existsSync(newImage)) {
        fs.unlinkSync(newImage);
      }
      else {
        console.log('Could not find the file at service.ts')
      }
      if (oldImage) {
        try {
          const results = cloudinary.uploader.destroy(oldImage);
        } catch (err) {
          console.error("Error destroing image from cloudinary at service.ts file", err);
        }
      }
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } else {
    newImagePath = imgPath
  }
  service.title = title;
  service.description = description;
  service.price = price;
  service.image = newImagePath;
  await service.save();
  res.status(200).json({ message: 'Product updated successfully' });
}

export const deleteServiceS = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      res.status(404).json({ message: 'service not found' });
      return;
    }
    const image = deletedService.image;
    if (image) {
      try {
        cloudinary.uploader.destroy(image);
      } catch (err) {
        console.error("Error destroing image from cloudinary at service.ts file", err);
      }
    }
    res.status(200).json({ message: "service deleted" });
  } catch (error) {
    console.error("Error deleting service", error);
    res.status(400).json({ error: 'Internal server error' });
  }
}

export const markCompletedF = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    service.isCompleted = true;
    await service.save();
    return res.status(200).json({ message: 'Service trashed successfully' });

  } catch (error) {
    console.error("Error while trashing service at adminFeatures.ts", error);
    return res.status(400).json({ error: 'Error while trashing service at adminFeatures.ts' });
  }
}

export const markHiredF = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    service.isHiringClosed = true;
    await service.save();
    return res.status(200).json({ message: 'Service unTrashed successfully' });
  } catch (error) {
    console.error("Error while unTrashing service at adminFeatures.ts", error);
    return res.status(400).json({ error: 'Error while unTrashing service at adminFeatures.ts' });
  }
}

export const showCompletedServiceF = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isCompleted: true }).sort({ createdAt: -1 });
    return res.status(200).json({ message: 'this is the service', services });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}

export const showHiredServiceF = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isHiringClosed: true }).sort({ createdAt: -1 });
    return res.status(200).json({ message: 'this is the service', services });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}

export const showServiceDetailsF = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId).populate({
      path: "proposals",
      populate: {
        path: 'freelancer',
        model: 'Freelancer',
        populate: {
          path: 'user',
          model: 'User',
        }
      },
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.status(200).json({ message: 'this is the service', service });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}

export const hireFreelancerF = async (req: Request, res: Response) => {
  const { freelancerId, serviceId }  = req.body;
  const proposal = await Proposals.findOne({ 'service': serviceId, 'freelancer': freelancerId });
  if (!proposal) {
    console.error('Could not find the proposal at adminFeatures.ts');
    return res.status(404).json({ error: 'Proposal not found' });
  }
  if(proposal.status === 'accepted') {
    return res.status(400).json({ error: 'Already hired' });
  }
  proposal.status = 'accepted';
  await proposal.save();
  const newService = await Service.findById(serviceId);
  if (!newService) {
    console.error('Could not find the service at adminFeatures.ts');
    return res.status(404).json({ error: 'Service not found' });
  }
  newService.hiredFreelancers.push(freelancerId);
  newService.hiredCount = (newService.hiredCount ?? 0 )+ 1;
  if (newService.hiredCount === newService.requiredFreelancers) {
    newService.isHiringClosed = true;
  }
  await newService.save();
  res.status(201).json({ message: 'Hired successfully' });
}

export const isHird = async (req: Request, res: Response) => {
  const {userId, service} = req.body;
  const proposal = await Proposals.findOne({ 'service': service, 'freelancer': userId });
}

export const showUsersF = async (req: Request, res: Response) => {
  const users = await User.find();
  return res.status(200).json(users);
}

export const sendFreelancerDetailsF = async (req: Request, res: Response) => {
  try {
    console.log('the body is', req.body);
    const { id } = req.body; 
    const freelancer = await Freelancer.findOne({ _id: id });

    if (freelancer) {
      console.log('the freelancer is', freelancer);
      const user = await User.findOne({ _id: freelancer.user });
      console.log('user is', user);
      const data =  { freelancer : freelancer, user : user };
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Freelancer not found' });
    }
  } catch (error) {
    console.error('Error finding freelancer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendFreelancerProposalsF = async (req: Request, res: Response) => {
  try {
    console.log('the body is', req.body);
    const { id } = req.body;
    const proposal = await Proposals.findOne({ _id: id });
    if (proposal) {
      const freelancer = await Freelancer.findOne({ _id: proposal.freelancer });
      if (!freelancer) {
        res.status(404).json({ message: 'Freelancer not found' });
        return;
      }
      const user = await User.findOne({_id: freelancer.user});
      const service = await Service.findOne({ _id: proposal.service });
      const userInfo =  { proposal : proposal, freelancer : freelancer, user : user, service : service };
      res.status(200).json(userInfo);
    } else {
      res.status(404).json({ message: 'Proposals not found' });
    }
  } catch (error) {
    console.error('Error finding proposals at adminFeatures.ts', error);
    res.status(500).json({ message: 'Server error' });
  }
}