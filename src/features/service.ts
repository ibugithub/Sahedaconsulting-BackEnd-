import { Request, Response } from "express"
import { Product } from "../models/Product"
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

export const serviceUploadS = async (req: Request, res: Response) => {
  const imagePath = (req.file as Express.Multer.File).path.replace(/\\/g, "/")
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const results = await cloudinary.uploader.upload(imagePath, options);
    const { product, description, quantity, price } = req.body
    const newProduct = new Product({
      name: product,
      description: description,
      price: price,
      quantity: quantity,
      image: results.public_id
    })
    await newProduct.save()
    return res.status(200).json({ message: 'product will be uploaded' })
  } catch (err) {
    console.error("Error while uploading image on cloudinary at productService.ts", err);
  }
  finally {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.log('Could not find the file at productService.ts')
    }
  }

}

export const showServiceS = async (req: Request, res: Response) => {
  const products = await Product.find();
  return res.status(200).json({ message: 'this is the products', products });
}

export const updateServiceS = async (req: Request, res: Response) => {
  const prodId = req.params.id;
  const { name, description, price, quantity, imgPath } = req.body;
  const product = await Product.findById(prodId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

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
      product.name = name;
      product.description = description;
      product.price = price;
      product.quantity = quantity;
      product.image = results.public_id
      await product.save();
    } catch (error) {
      console.error("Error while editing the image at productService.ts", error);
    } finally {
      if (fs.existsSync(newImage)) {
        fs.unlinkSync(newImage);
      }
      else {
        console.log('Could not find the file at productService.ts')
      }
      if (oldImage) {
        try {
          const results = cloudinary.uploader.destroy(oldImage);
        } catch (err) {
          console.error("Error destroing image from cloudinary at productService.ts file", err);
        }
      }
    }

  }
  res.status(200).json({ message: 'Product updated successfully', product: product });
}

export const deleteServiceS = async (req: Request, res: Response) => {
  try {
    const prodId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(prodId);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const image = deletedProduct.image;
    try {
      const results = cloudinary.uploader.destroy(image);
    } catch (err) {
      console.error("Error destroing image from cloudinary at productService.ts file", err);
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(400).json({ error: 'Internal server error' });
  }
}