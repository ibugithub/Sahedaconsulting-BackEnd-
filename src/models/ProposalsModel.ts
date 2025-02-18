import mongoose from "mongoose";
import { ProposalInterface } from "../interface";

const Proposalschema = new mongoose.Schema<ProposalInterface>({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
},
  { timestamps: true })

export const Proposals = mongoose.model('Proposals', Proposalschema)