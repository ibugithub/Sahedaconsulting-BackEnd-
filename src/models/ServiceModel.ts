import mongoose from "mongoose";

const serviceShema = new mongoose.Schema({
  title: {
    type: "string",
    required: true
  },
  description: {
    type: "string",
    required: true
  },
  price: {
    type: "number",
    required: true
  },
  image: {
    type: "string"
  },
  skills : [String],
  proposals : [{type: mongoose.Schema.Types.ObjectId, ref: 'Proposals'}],  
  appliedFreelancers : [{type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer'}],
  proposalsCount : {
    type: "number",
    default: 0
  },
  hiredFreelancers : [{type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer'}],
  hiredCount : {type: "number", default: 0},
  isHiringClosed : {type: "boolean", default: false},
  isTrashed : {type: "boolean", default: false}
}, 
{timestamps: true}
);

export const Service = mongoose.model('Service', serviceShema)