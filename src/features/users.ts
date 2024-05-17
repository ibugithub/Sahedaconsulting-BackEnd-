import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import '../../dotenv'
import { generateAccessToken } from '../Utils/jwtUtils';
import { User } from '../models/User';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
const JWT_SECRET = process.env.JWT_SECRET || "";

export const refreshTokenF = (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decodeToken = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload
    const accessToken = generateAccessToken({ userId: decodeToken.userId, email: decodeToken.email })
    return res.status(200).json({ message: 'New Access Token has been created', accessToken: accessToken })
  } catch (err) {
    console.error("error in generating Accesstoken at 'refreshTokenF' at users.ts ", err);
    return res.status(401).json({ message: 'Invalid refresh  token' })
  }
}

const tokenToId = (token: string) => {
  const parsedAccessToken = JSON.parse(token)
  try {
    const decodedToken = jwt.verify(parsedAccessToken, JWT_SECRET) as JwtPayload
    return decodedToken.userId
  } catch (err) {
    console.error('error while verifing accessToken', err)
  }
}

export const sendProfileDataF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  if (typeof accessToken !== 'string') { 
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string'});
  }
  const id = tokenToId(accessToken)
  if (!id) {
    return res.status(401).json({ message: 'error while verifying access token'});
  }
  try {
    const user = await User.findById(id)
    const data = { 'firstName' : user?.firstName, 'lastName' : user?.lastName, 'email': user?.email, 'image': user?.image }
    return res.status(200).json({ message: 'successfully sent the profile data', userInfo: data });
  } catch (e) {
    console.error('error while querying for user', e)
    return res.status(401).json({ message: 'error while querying for user', error: e });
  }
}

export const setImageF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  if (typeof accessToken !== 'string') { 
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string'});
  }
  const id = tokenToId(accessToken)
  if (!id) {
    return res.status(401).json({ message: 'error while verifying access token'});
  }
  const imagePath = (req.file as Express.Multer.File).path.replace(/\\/g, "/")
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const results = await cloudinary.uploader.upload(imagePath, options);
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.image = results.public_id
    await user.save();
    return res.status(200).json({ message: 'Image has been uploaded successfully', imgPath: results.public_id})
  } catch (err) {
    console.error("Error while uploading image on cloudinary at user.ts", err);
  }

  finally {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.log('Could not find the file at service.ts')
    }
    const oldImage = req.body.oldImage;
    cloudinary.uploader.destroy(oldImage);
  }
}

export const saveUserDataF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  const userData = req.body
  if (typeof accessToken !== 'string') { 
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string'});
  }
  const id = tokenToId(accessToken)
  if (!id) {
    return res.status(401).json({ message: 'error while verifying access token'});
  }
  const user = await User.findById(id);
  if (!user) {
    console.error('Could not find user at user.ts');
    return res.status(401).json({message: 'user not found'});
  }
  user.firstName = userData.first_name
  user.lastName = userData.last_name
  await user.save();
  return res.status(200).json({ message: "User data has been updated successfully."})
}