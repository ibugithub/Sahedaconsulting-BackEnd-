import {Types} from "mongoose";

export interface UserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cPassword: string;
  image?: string;
  role: 'buyer' | 'freelancer' | 'administrator';
}

export interface FreelancerInterface {
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

export interface ServiceInterface {
  title: string;
  description: string;
  price: number;
  image?: string;
  skills: string[];
  proposals: Types.ObjectId[];
  appliedFreelancers: Types.ObjectId[];
  proposalsCount?: number;
  hiredFreelancers: Types.ObjectId[];
  hiredCount?: number;
  isHiringClosed?: boolean;
  isCompleted?: boolean;
}

export interface ProposalInterface {
  freelancer: Types.ObjectId;
  service: Types.ObjectId;
  coverLetter: string;
  price: number;
  status?: 'pending' | 'accepted' | 'rejected';
}
