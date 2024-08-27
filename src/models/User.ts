import  mongoose from 'mongoose' 
import { UserInterface, FreelancerInterface } from '../interface';

const userSchema = new mongoose.Schema<UserInterface>({
 firstName: { type: String, required: true },
 lastName: { type: String, required: true},
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true, selected: false},
 image: {type: String},
 role: {type: String, enum: ['buyer', 'freelancer', 'administrator', 'engineeringAdmin', 'managementAdmin', 'itAdmin']},
});

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName} `
}

export const User = mongoose.model('User', userSchema);

const buyerSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  address : {type : String},
  phone : {type: String},
  companyName: {
    type: String
  },
  companyDescription: {
    type: String,
  },
});

export const Buyer = mongoose.model('Buyer', buyerSchema)

const freelancerSchema = new mongoose.Schema<FreelancerInterface>({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  skills : {type: [String]},
  address : {type : String},
  phone : {type: String},
  profileTitle: { type: String},
  overview: {type: String},
  employmentHistory: [{ jobTitle: String, company: String, startDate: Date, endDate: Date }],
  proposals : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposals' }],
  hireCount: {type: Number, default: 0}
});

export const Freelancer = mongoose.model('Freelancer', freelancerSchema)