"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const serviceShema = new mongoose_1.default.Schema({
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
    skills: [String],
    adminUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposals: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Proposals' }],
    appliedFreelancers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Freelancer' }],
    proposalsCount: {
        type: "number",
        default: 0
    },
    hiredFreelancers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Freelancer' }],
    hiredCount: { type: "number", default: 0 },
    isHiringClosed: { type: "boolean", default: false },
    requiredFreelancers: { type: "number", default: 1 },
    isCompleted: { type: "boolean", default: false }
}, { timestamps: true });
exports.Service = mongoose_1.default.model('Service', serviceShema);
//# sourceMappingURL=ServiceModel.js.map