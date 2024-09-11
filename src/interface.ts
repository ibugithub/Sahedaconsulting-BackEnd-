import mongoose, { Document, Schema, Types } from "mongoose";


export enum UserRole {
  Buyer = 'buyer',
  Freelancer = 'freelancer',
  Administrator = 'administrator',
}


export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cPassword: string;
  image?: string;
  role: UserRole;
  isVerified: boolean;
}

export interface FreelancerInterface extends Document {
  user: Types.ObjectId;
  skills: string[];
  address?: string;
  phone?: string;
  profileTitle?: string;
  overview?: string;
  employmentHistory: {
    jobTitle: string;
    company: string;
    startDate: Date;
    endDate?: Date;
  }[];
  proposals: Types.ObjectId[];
  hireCount?: number;
}

export interface ServiceInterface extends Document {
  title: string;
  description: string;
  price: number;
  image?: string;
  skills: string[];
  adminUser: Types.ObjectId;
  proposals: Types.ObjectId[];
  appliedFreelancers: Types.ObjectId[];
  proposalsCount?: number;
  hiredFreelancers: Types.ObjectId[];
  hiredCount?: number;
  isHiringClosed?: boolean;
  isCompleted?: boolean;
  requiredFreelancers: number;
}

export interface ProposalInterface extends Document {
  freelancer: Types.ObjectId;
  service: Types.ObjectId;
  coverLetter: string;
  price: number;
  status?: 'pending' | 'accepted' | 'rejected';
}
