import { Request, Response } from "express";
import { Service } from "../models/ServiceModel";

export const showWorksFeature = async(req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({ message: 'this is the service', services });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}

export const showWorkFeature = async(req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const service = await Service.findById(id);
    return res.status(200).json({ message: 'this is the service', service });
  } catch (error) {
    console.error('Could not find the service at service.ts', error);
  }
}