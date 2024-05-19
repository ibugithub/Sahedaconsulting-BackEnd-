import  mongoose from 'mongoose' 

const userSchema = new mongoose.Schema({
 firstName: { type: String, required: true },
 lastName: { type: String, required: true},
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true, selected: false},
 image: {type: String},
 role: {type: String, enum: ['buyer', 'freelancer'], default:'buyer'}
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
    type: String, required: true
  },
  companyDescription: {
    type: String,
    required: true
  },
});

export const Buyer = mongoose.model('Buyer', buyerSchema)


const freelancerSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  skills : {type: [String], required: true},
  address : {type : String},
  phone : {type: String},
  profileTitle: { type: String, required: true },
  overview: {type: String, required: true},
  employmentHistory: [{ jobTitle: String, company: String, startDate: Date, endDate: Date }],
});

export const Freelancer = mongoose.model('Freelancer', freelancerSchema)