import { ObjectId } from "mongodb";

export interface UserInterface {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cPassword: string;
  image: string;
  role: 'buyer' | 'freelancer' | 'administrator';
  getFullName(): string;
}

export interface FreelancerInterface {
  _id: ObjectId;
  user: UserInterface;
  skills: string[];
  address?: string;
  phone?: string;
  profileTitle?: string;
  overview?: string;
  employmentHistory: {
    jobTitle: string;
    company: string;
    startDate: Date;
    endDate: Date;
  }[];
  proposals: ProposalInterface[];
  hireCount: number;
}

// Service Interface
export interface ServiceInterface {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  image?: string;
  skills: string[];
  proposals: ProposalInterface[];
  appliedFreelancers: FreelancerInterface[];
  proposalsCount: number;
  hiredFreelancers: FreelancerInterface[];
  hiredCount: number;
  isHiringClosed: boolean;
  isCompleted: boolean;
}

export interface ProposalInterface {
  _id: ObjectId;
  freelancer : FreelancerInterface;
  service: ServiceInterface;
  price: number;
  coverLetter: string;
  createdAt: Date;
  updatedAt: Date;
}