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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSecretCodeF = exports.createSecretCodeF = exports.showSecretCodesF = exports.deleteUserF = exports.addNewUsersF = exports.changeUserRoleF = exports.sendFreelancerProposalsF = exports.sendFreelancerDetailsF = exports.showUsersF = exports.isHird = exports.hireFreelancerF = exports.showServiceDetailsF = exports.showHiredServiceF = exports.showCompletedServiceF = exports.markHiredF = exports.markCompletedF = exports.deleteServiceS = exports.updateServiceS = exports.showServiceS = exports.serviceUploadS = void 0;
const ServiceModel_1 = require("../models/ServiceModel");
const User_1 = require("../models/User");
const User_2 = require("../models/User");
const ProposalsModel_1 = require("../models/ProposalsModel");
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_3 = require("../models/User");
const generateSecretCode_1 = require("../Utils/generateSecretCode");
const notifications_1 = require("../Utils/notifications");
const serviceUploadS = (req, res, adminUser) => __awaiter(void 0, void 0, void 0, function* () {
    let imagePath = "";
    let results = { public_id: "noImage" };
    if (req.file) {
        imagePath = req.file.path.replace(/\\/g, "/");
    }
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try {
        if (imagePath) {
            results = yield cloudinary_1.v2.uploader.upload(imagePath, options);
        }
        const { service, description, price, requiredFreelancer } = req.body;
        const newService = new ServiceModel_1.Service({
            adminUser: adminUser._id,
            title: service,
            description: description,
            price: price,
            requiredFreelancers: requiredFreelancer,
            image: results.public_id
        });
        yield newService.save();
        return res.status(200).json({ message: 'Service will be uploaded' });
    }
    catch (err) {
        console.error("Error while uploading image on cloudinary at service.ts", err);
    }
    finally {
        if (imagePath && fs_1.default.existsSync(imagePath)) {
            fs_1.default.unlinkSync(imagePath);
        }
        else {
            console.log('Could not find the file at service.ts');
        }
    }
});
exports.serviceUploadS = serviceUploadS;
const showServiceS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield ServiceModel_1.Service.find({ isHiringClosed: { $ne: true } }).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'this is the service', services });
    }
    catch (error) {
        console.error('Could not find the service at service.ts', error);
    }
});
exports.showServiceS = showServiceS;
const updateServiceS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceId = req.params.id;
    const { title, description, price, imgPath } = req.body;
    const service = yield ServiceModel_1.Service.findById(serviceId);
    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }
    let newImagePath;
    if (req.file) {
        const newImage = req.file.path.replace(/\\/g, "/");
        const oldImage = imgPath;
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };
        try {
            const results = yield cloudinary_1.v2.uploader.upload(newImage, options);
            newImagePath = results.public_id;
        }
        catch (error) {
            console.error("Error while editing the image at service.ts", error);
        }
        finally {
            if (fs_1.default.existsSync(newImage)) {
                fs_1.default.unlinkSync(newImage);
            }
            else {
                console.log('Could not find the file at service.ts');
            }
            if (oldImage) {
                try {
                    const results = cloudinary_1.v2.uploader.destroy(oldImage);
                }
                catch (err) {
                    console.error("Error destroing image from cloudinary at service.ts file", err);
                }
            }
        }
        res.status(200).json({ message: 'Product updated successfully' });
    }
    else {
        newImagePath = imgPath;
    }
    service.title = title;
    service.description = description;
    service.price = price;
    service.image = newImagePath;
    yield service.save();
    res.status(200).json({ message: 'Product updated successfully' });
});
exports.updateServiceS = updateServiceS;
const deleteServiceS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const deletedService = yield ServiceModel_1.Service.findByIdAndDelete(serviceId);
        if (!deletedService) {
            res.status(404).json({ message: 'service not found' });
            return;
        }
        const image = deletedService.image;
        if (image) {
            try {
                cloudinary_1.v2.uploader.destroy(image);
            }
            catch (err) {
                console.error("Error destroing image from cloudinary at service.ts file", err);
            }
        }
        res.status(200).json({ message: "service deleted" });
    }
    catch (error) {
        console.error("Error deleting service", error);
        res.status(400).json({ error: 'Internal server error' });
    }
});
exports.deleteServiceS = deleteServiceS;
const markCompletedF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const service = yield ServiceModel_1.Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        service.isCompleted = true;
        yield service.save();
        return res.status(200).json({ message: 'Service trashed successfully' });
    }
    catch (error) {
        console.error("Error while trashing service at adminFeatures.ts", error);
        return res.status(400).json({ error: 'Error while trashing service at adminFeatures.ts' });
    }
});
exports.markCompletedF = markCompletedF;
const markHiredF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const service = yield ServiceModel_1.Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        service.isHiringClosed = true;
        yield service.save();
        return res.status(200).json({ message: 'Service unTrashed successfully' });
    }
    catch (error) {
        console.error("Error while unTrashing service at adminFeatures.ts", error);
        return res.status(400).json({ error: 'Error while unTrashing service at adminFeatures.ts' });
    }
});
exports.markHiredF = markHiredF;
const showCompletedServiceF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield ServiceModel_1.Service.find({ isCompleted: true }).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'this is the service', services });
    }
    catch (error) {
        console.error('Could not find the service at service.ts', error);
    }
});
exports.showCompletedServiceF = showCompletedServiceF;
const showHiredServiceF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield ServiceModel_1.Service.find({ isHiringClosed: true }).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'this is the service', services });
    }
    catch (error) {
        console.error('Could not find the service at service.ts', error);
    }
});
exports.showHiredServiceF = showHiredServiceF;
const showServiceDetailsF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceId = req.params.id;
        const service = yield ServiceModel_1.Service.findById(serviceId).populate({
            path: "proposals",
            populate: {
                path: 'freelancer',
                model: 'Freelancer',
                populate: {
                    path: 'user',
                    model: 'User',
                }
            },
        });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        return res.status(200).json({ message: 'this is the service', service });
    }
    catch (error) {
        console.error('Could not find the service at service.ts', error);
    }
});
exports.showServiceDetailsF = showServiceDetailsF;
const hireFreelancerF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { freelancerId, serviceId } = req.body;
    const proposal = yield ProposalsModel_1.Proposals.findOne({ 'service': serviceId, 'freelancer': freelancerId });
    if (!proposal) {
        console.error('Could not find the proposal at adminFeatures.ts');
        return res.status(404).json({ error: 'Proposal not found' });
    }
    const newService = yield ServiceModel_1.Service.findById(serviceId);
    if (!newService) {
        console.error('Could not find the service at adminFeatures.ts');
        return res.status(404).json({ error: 'Service not found' });
    }
    if (proposal.status === 'accepted') {
        return res.status(400).json({ error: 'Already hired' });
    }
    proposal.status = 'accepted';
    yield proposal.save();
    newService.hiredFreelancers.push(freelancerId);
    newService.hiredCount = ((_a = newService.hiredCount) !== null && _a !== void 0 ? _a : 0) + 1;
    if (newService.hiredCount === newService.requiredFreelancers) {
        newService.isHiringClosed = true;
    }
    yield newService.save();
    // Adding notification for freelancer
    const adminUser = yield User_1.User.findById(newService.adminUser);
    const freelancer = yield User_2.Freelancer.findById(freelancerId).populate('user');
    const user = yield User_1.User.findById(freelancer === null || freelancer === void 0 ? void 0 : freelancer.user);
    if (!user || !adminUser) {
        console.error('Freelancer or admin user not found at hireFreelancerF at adminFeatures.ts');
        return res.status(404).json({ message: 'Freelancer or admin user not found' });
    }
    const message = `Congratulation you've been hired by ${adminUser === null || adminUser === void 0 ? void 0 : adminUser.firstName} ${adminUser === null || adminUser === void 0 ? void 0 : adminUser.lastName} for service ${newService.title}`;
    yield (0, notifications_1.AddNotification)(user, message, 'freelancerHired', proposal._id);
    // sending the notification to the freelancer
    const io = req.app.get('socketio');
    io.emit(`${user._id}freelancerHiredNotification`, { message: 'freelancer hired notification sent from the adminFeatures.ts' });
    res.status(201).json({ message: 'Hired successfully' });
});
exports.hireFreelancerF = hireFreelancerF;
const isHird = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, service } = req.body;
    const proposal = yield ProposalsModel_1.Proposals.findOne({ 'service': service, 'freelancer': userId });
});
exports.isHird = isHird;
const showUsersF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find();
    return res.status(200).json(users);
});
exports.showUsersF = showUsersF;
const sendFreelancerDetailsF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const freelancer = yield User_2.Freelancer.findOne({ _id: id });
        if (freelancer) {
            const user = yield User_1.User.findOne({ _id: freelancer.user });
            const data = { freelancer: freelancer, user: user };
            res.status(200).json(data);
        }
        else {
            res.status(404).json({ message: 'Freelancer not found' });
        }
    }
    catch (error) {
        console.error('Error finding freelancer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.sendFreelancerDetailsF = sendFreelancerDetailsF;
const sendFreelancerProposalsF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const proposal = yield ProposalsModel_1.Proposals.findOne({ _id: id });
        if (proposal) {
            const freelancer = yield User_2.Freelancer.findOne({ _id: proposal.freelancer });
            if (!freelancer) {
                res.status(404).json({ message: 'Freelancer not found' });
                return;
            }
            const user = yield User_1.User.findOne({ _id: freelancer.user });
            const service = yield ServiceModel_1.Service.findOne({ _id: proposal.service });
            const userInfo = { proposal: proposal, freelancer: freelancer, user: user, service: service };
            res.status(200).json(userInfo);
        }
        else {
            res.status(404).json({ message: 'Proposals not found' });
        }
    }
    catch (error) {
        console.error('Error finding proposals at adminFeatures.ts', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.sendFreelancerProposalsF = sendFreelancerProposalsF;
const changeUserRoleF = (req, res, userId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    user.role = newRole;
    yield user.save();
    return res.status(200).json({ message: 'Role changed successfully' });
});
exports.changeUserRoleF = changeUserRoleF;
const addNewUsersF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, role } = req.body;
    if (!firstName || !lastName || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const wantedRoles = ['administrator', 'engineeringAdmin', 'managementAdmin', 'itAdmin'];
    if (!wantedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    try {
        const existedUser = yield User_1.User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const password = 'admin';
        const hasedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new User_1.User({ firstName, lastName, email, role, password: hasedPassword });
        console.log('the user password is ', user.password);
        yield user.save();
        return res.status(201).json({ message: 'User added successfully' });
    }
    catch (error) {
        console.error('Error occurred while adding a new user:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.addNewUsersF = addNewUsersF;
const deleteUserF = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    yield User_1.User.findByIdAndDelete(id);
    return res.status(201).json({ message: 'User deleted successfully' });
});
exports.deleteUserF = deleteUserF;
const showSecretCodesF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codes = yield User_3.secretCode.find();
    return res.status(201).json({ message: 'Secret codes fetched successfully', codes: codes });
});
exports.showSecretCodesF = showSecretCodesF;
const createSecretCodeF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, generateSecretCode_1.GenerateSecretCode)();
    return res.status(201).json({ message: 'Secret code generated successfully', code: code });
});
exports.createSecretCodeF = createSecretCodeF;
const deleteSecretCodeF = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_3.secretCode.findByIdAndDelete(id);
    return res.status(201).json({ message: 'Secret code deleted successfully' });
});
exports.deleteSecretCodeF = deleteSecretCodeF;
