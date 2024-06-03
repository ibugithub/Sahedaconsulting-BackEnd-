import { Request, Response } from "express"
import { Service } from "../models/ServiceModel"
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
    const { service, description, price } = req.body
    const newService = new Service({
      title: service,
      description: description,
      price: price,
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
  const services = await Service.find();
  return res.status(200).json({ message: 'this is the service', services });
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
        const results = cloudinary.uploader.destroy(image);
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