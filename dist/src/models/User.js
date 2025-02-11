"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretCode = exports.Freelancer = exports.Buyer = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, selected: false },
    image: { type: String },
    role: { type: String, enum: ['buyer', 'freelancer', 'administrator', 'engineeringAdmin', 'managementAdmin', 'itAdmin'] },
    isVerified: { type: Boolean, default: false },
});
userSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName} `;
};
exports.User = mongoose_1.default.model('User', userSchema);
const buyerSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String },
    phone: { type: String },
    companyName: {
        type: String
    },
    companyDescription: {
        type: String,
    },
});
exports.Buyer = mongoose_1.default.model('Buyer', buyerSchema);
const freelancerSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: { type: [String] },
    address: { type: String },
    phone: { type: String },
    profileTitle: { type: String },
    overview: { type: String },
    employmentHistory: [{ jobTitle: String, company: String, startDate: Date, endDate: Date }],
    proposals: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Proposals' }],
    hireCount: { type: Number, default: 0 }
});
exports.Freelancer = mongoose_1.default.model('Freelancer', freelancerSchema);
const secretCodeschema = new mongoose_1.default.Schema({
    code: { type: String, required: true }
});
exports.secretCode = mongoose_1.default.model('SecretCode', secretCodeschema);
//# sourceMappingURL=User.js.map