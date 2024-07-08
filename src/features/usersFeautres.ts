import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import '../../dotenv'
import { User } from '../models/User';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../Utils/jwtUtils';
import { isAdministrator, isAuthenticated } from '../Utils/auth';
import { UserInterface } from '../interface';
import { Buyer, Freelancer } from '../models/User';
const JWT_SECRET = process.env.JWT_SECRET || "";


export const registerF = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      cPassword,
      role,
    }: UserInterface = req.body;
    if (!firstName || !lastName || !email || !password || !cPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== cPassword) {
      return res.status(400).json({ error: "password do not match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hasedPassword,
      role: role
    });

    try {
      if (role === 'buyer') {
        const newBuyer = new Buyer({
          user: newUser._id,
          address: '',
          phone: '',
          companyName: '',
          companyDescription: '',
        })
        await newBuyer.save();
      }
      if (role === 'freelancer') {
        const newFreelancer = new Freelancer({
          user: newUser._id,
          skills: [],
          address: '',
          phone: '',
          profileTitle: '',
          overview: '',
          employmentHistory: [],
          proposals: [],
          hireCount: 0
        })
        await newFreelancer.save();
      }
    } catch (error) {
      console.error('error while creating Buyer or Freelancer account', error)
      return res.status(401).json({ message: 'Error while creating Buyer or Freelancer account', error: error })
    }
    await newUser.save();

    res.status(201).json({ message: "User has been registered successfully" });
  } catch (error) {
    console.error('Error while registering the user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const loginF = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid Credintails" })
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid Credintails" });
    }
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });
    res.status(200).json({ message: "Login successful", name: user.firstName + user.lastName, email: user.email, accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error('Error logging in', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const isAuthenticatedF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  if (typeof accessToken !== 'string') {
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string' });
  }
  try {
    const user = await isAuthenticated(accessToken);
    return res.status(200).json({ message: 'User is authenticated', user });
  } catch (error) {
    console.error('Authentication error at users.ts:', error);
    return res.status(401).json({ message: 'Error while authenticating user at users.ts', error });
  }
}

export const isAdministratorF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  if (typeof accessToken !== 'string') {
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string' });
  }
  try {
    const user = await isAdministrator(accessToken);
    return res.status(200).json({ message: 'User is an administrator', user });
  } catch (e) {
    console.error('error while checking if user is an administrator at users.ts', e);
    return res.status(401).json({ message: 'Error while checking admin user at users.ts', e });
  }
}
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

export const sendProfileDataF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken;

  if (typeof accessToken !== 'string') {
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string' });
  }

  try {
    const user = await isAuthenticated(accessToken);

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch additional freelancer data
    let data;
    if (user.role === 'freelancer') {
      const freelancer = await Freelancer.findOne({ user: user._id }).populate('proposals');
      if (!freelancer) {
        return res.status(404).json({ message: 'Freelancer profile not found' });
      }

      data = {
        id: freelancer._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        skills: freelancer.skills,
        address: freelancer.address,
        phone: freelancer.phone,
        profileTitle: freelancer.profileTitle,
        overview: freelancer.overview,
        employmentHistory: freelancer.employmentHistory,
        proposals: freelancer.proposals.map(p => p._id),
        hireCount: freelancer.hireCount,
        role: user.role
      };
    } else if (user.role === 'administrator') {
      const administrator = await User.findById(user._id);
      if (!administrator) {
        return res.status(404).json({ message: 'admin profile not found' });
      }
      data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      };
    } else if (user.role === 'buyer') {
      const buyer = await User.findById(user._id);
      if (!buyer) {
        return res.status(404).json({ message: 'buyer profile not found' });
      }
      data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      };
    }

    return res.status(200).json({ message: 'Successfully sent the profile data', userInfo: data });
  } catch (e) {
    console.error('Error while authenticating user at users.ts', e);
    return res.status(401).json({ message: 'Error while authenticating user at users.ts', error: e });
  }
};

export const setImageF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  if (typeof accessToken !== 'string') {
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string' });
  }

  try {
    const user = await isAuthenticated(accessToken);
    const imagePath = (req.file as Express.Multer.File).path.replace(/\\/g, "/")
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      const results = await cloudinary.uploader.upload(imagePath, options);
      user.image = results.public_id
      await user.save();
      return res.status(200).json({ message: 'Image has been uploaded successfully', imgPath: results.public_id })
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
  } catch (e) {
    console.error('error while authenticating user at users.ts', e)
    return res.status(401).json({ message: 'error while authenticating user at users.ts', error: e });
  }
}

export const saveUserDataF = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken
  const userData = req.body
  console.log('the body is', req.body)
  if (typeof accessToken !== 'string') {
    console.error('Access token must be a string at user.ts file');
    return res.status(401).json({ message: 'Access token must be a string' });
  }

  try {
    const user = await isAuthenticated(accessToken);
    if (!user) {
      console.error('Could not find user at user.ts');
      return res.status(401).json({ message: 'user not found' });
    }
    user.firstName = userData.first_name
    user.lastName = userData.last_name
    const freelancer = await Freelancer.findById(userData.id)
    if (!freelancer) {
      return res.status(404).json({ message: 'freelancer not found at userFeatures.ts' });
    }
    freelancer.profileTitle = userData.profileTitle
    freelancer.overview = userData.overview
    freelancer.phone = userData.phone
    freelancer.address = userData.address
    freelancer.skills = userData.skills
    freelancer.employmentHistory = userData.employmentHistory
    await user.save();
    await freelancer.save();
    // console.log('I am in the usersFeatures from handleSaveEmployment', freelancer)
    return res.status(200).json({ message: "User data has been updated successfully." })
  } catch (e) {
    console.error('error while authenticating user at users.ts', e)
    return res.status(401).json({ message: 'error while authenticating user at users.ts', error: e });
  }
}