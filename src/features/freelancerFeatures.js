"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showFreelancerProposalsF = exports.showFreelancerOffersF = exports.isAppliedF = exports.addProposalF = exports.showWorkFeature = exports.showWorksFeature = void 0;
const ServiceModel_1 = require("../models/ServiceModel");
const ProposalsModel_1 = require("../models/ProposalsModel");
const User_1 = require("../models/User");
const proposals_1 = require("../Utils/proposals");
const auth_1 = require("../Utils/auth");
const notifications_1 = require("../Utils/notifications");
const showWorksFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield ServiceModel_1.Service.find({ isHiringClosed: { $ne: true } }).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'this is the service', services });
    }
    catch (error) {
        console.error('Could not find the service at service.ts', error);
    }
});
exports.showWorksFeature = showWorksFeature;
const showWorkFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const service = yield ServiceModel_1.Service.findById(id);
        return res.status(200).json({ message: 'this is the service', service });
    }
    catch (error) {
        console.error('Could not find the service at findWorkFeatures.ts', error);
        return res.status(404).json({ message: 'Could not find the service at findWorkFeatures.ts' });
    }
});
exports.showWorkFeature = showWorkFeature;
const addProposalF = (req, res, user, proposalData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const freelancer = yield User_1.Freelancer.findOne({ 'user': user._id }).populate('user');
        const service = yield ServiceModel_1.Service.findById(proposalData.service);
        const freelanceUser = yield User_1.User.findById(user._id);
        if (!freelancer || !service || !freelanceUser) {
            console.error('Freelancer or service not found');
            return res.status(404).json({ message: 'Freelancer or service not found' });
        }
        const existingProposal = yield (0, proposals_1.isAlreadyApplied)(freelancer._id, service._id);
        if (existingProposal) {
            console.error('You already have a proposal for this service');
            return res.status(400).json({ message: 'You already have a proposal for this service' });
        }
        const newProposal = new ProposalsModel_1.Proposals({
            freelancer: freelancer,
            service: proposalData.service,
            coverLetter: proposalData.coverLetter,
            price: proposalData.price,
        });
        freelancer.proposals.push(newProposal._id);
        service.proposals.push(newProposal._id);
        service.proposalsCount = ((_a = service.proposalsCount) !== null && _a !== void 0 ? _a : 0) + 1;
        service.appliedFreelancers.push(freelancer._id);
        yield newProposal.save();
        yield freelancer.save();
        yield service.save();
        const adminUser = yield User_1.User.findById(service.adminUser);
        if (!adminUser) {
            console.error('Admin user not found at freelancerFeatures.ts');
            return res.status(404).json({ message: 'Admin user not found at freelancerFeatures.ts' });
        }
        const message = `A proposal has been sent for ${service.title} by ${freelanceUser.firstName} ${freelanceUser.lastName}`;
        yield (0, notifications_1.AddNotification)(adminUser, message, 'addProposal', newProposal._id);
        const io = req.app.get('socketio');
        io.emit(`${adminUser._id}addProposalNotification`, { message: 'add proposal notification sent from the freelancerFeature.ts to notification.tsx' });
    }
    catch (error) {
        console.error('Error while creating proposal', error);
        return res.status(500).json({ message: 'Error while creating proposal', error: error });
    }
    return res.status(200).json({ message: 'Proposal created successfully' });
});
exports.addProposalF = addProposalF;
const isAppliedF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_1.checkAuthentication)(req, res);
    if ((user === null || user === void 0 ? void 0 : user.role) !== 'freelancer') {
        return res.status(403).json({ message: 'Not a freelancer' });
    }
    const freelancer = yield User_1.Freelancer.findOne({ 'user': user._id }).populate('user');
    const serviceId = req.body.service;
    if (!freelancer) {
        console.error('Freelancer or service not found');
        return res.status(404).json({ message: 'Freelancer or service not found' });
    }
    const alreadyApplied = yield (0, proposals_1.isAlreadyApplied)(freelancer._id, serviceId);
    if (alreadyApplied) {
        return res.status(200).json({ message: 'applied', isApplied: true });
    }
    return res.status(200).json({ message: 'not applied', isApplied: false });
});
exports.isAppliedF = isAppliedF;
const showFreelancerOffersF = (req, res, user) => __awaiter(void 0, void 0, void 0, function* () {
    const freelancer = yield User_1.Freelancer.findOne({ user: user._id });
    if (!freelancer) {
        console.error('Freelancer not found');
        return res.status(404).json({ message: 'Freelancer not found' });
    }
    const proposals = yield ProposalsModel_1.Proposals.find({ freelancer: freelancer._id }).populate('service');
    if (!proposals) {
        console.error('Proposals not found');
        return res.status(404).json({ message: 'Proposals not found' });
    }
    const offers = proposals.filter(proposal => proposal.status === 'accepted');
    return res.status(200).json({ offers });
});
exports.showFreelancerOffersF = showFreelancerOffersF;
const showFreelancerProposalsF = (req, res, user) => __awaiter(void 0, void 0, void 0, function* () {
    const freelancer = yield User_1.Freelancer.findOne({ user: user._id });
    if (!freelancer) {
        console.error('Freelancer not found');
        return res.status(404).json({ message: 'Freelancer not found' });
    }
    const proposals = yield ProposalsModel_1.Proposals.find({ freelancer: freelancer._id }).populate('service');
    if (!proposals) {
        console.error('Proposals not found');
        return res.status(404).json({ message: 'Proposals not found' });
    }
    return res.status(200).json({ proposals });
});
exports.showFreelancerProposalsF = showFreelancerProposalsF;
