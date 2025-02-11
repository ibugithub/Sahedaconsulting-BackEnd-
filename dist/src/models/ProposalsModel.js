"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proposals = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Proposalschema = new mongoose_1.default.Schema({
    freelancer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Freelancer',
        required: true
    },
    service: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.Proposals = mongoose_1.default.model('Proposals', Proposalschema);
//# sourceMappingURL=ProposalsModel.js.map