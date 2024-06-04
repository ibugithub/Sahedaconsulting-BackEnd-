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
  proposalsCount : {
    type: "number",
    default: 0
  }
}, 
{timestamps: true}
);

export const Service = mongoose.model('Service', serviceShema)