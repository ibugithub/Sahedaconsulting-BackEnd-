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
exports.createSecretCodeC = exports.deleteSecretCodeC = exports.showSecretCodesC = exports.deleteUserC = exports.addNewUsersC = exports.changeUserRoleC = exports.sendFreelancerProposalsC = exports.sendFreelancerDetailsC = exports.showUsersC = exports.hireFreelancerC = exports.showServiceDetailsC = exports.showCompletedServiceC = exports.showHiredServiceC = exports.markHiredC = exports.markCompletedC = exports.deleteServiceC = exports.updateServiceC = exports.showServiceC = exports.serviceUploadC = void 0;
const adminFeatures_1 = require("../features/adminFeatures");
const auth_1 = require("../Utils/auth");
const ProposalsModel_1 = require("../models/ProposalsModel");
const serviceUploadC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.serviceUploadS)(req, res, adminUser);
});
exports.serviceUploadC = serviceUploadC;
const showServiceC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.showServiceS)(req, res);
});
exports.showServiceC = showServiceC;
const updateServiceC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.updateServiceS)(req, res);
});
exports.updateServiceC = updateServiceC;
const deleteServiceC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    try {
        const serviceId = req.params.id;
        const proposal = yield ProposalsModel_1.Proposals.findOne({ 'service': serviceId, status: 'accepted' });
        if (proposal) {
            return res.status(400).json({ error: 'Service is already hired so you can not delete it', customCode: 17 });
        }
    }
    catch (err) {
        console.error('error while getting serviceId and proposal at adminController.ts', err);
        return res.status(401).json({ message: 'error while getting serviceId and proposal at adminController.ts', err });
    }
    (0, adminFeatures_1.deleteServiceS)(req, res);
});
exports.deleteServiceC = deleteServiceC;
const markCompletedC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.markCompletedF)(req, res);
});
exports.markCompletedC = markCompletedC;
const markHiredC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.markHiredF)(req, res);
});
exports.markHiredC = markHiredC;
const showHiredServiceC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.showHiredServiceF)(req, res);
});
exports.showHiredServiceC = showHiredServiceC;
const showCompletedServiceC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.showCompletedServiceF)(req, res);
});
exports.showCompletedServiceC = showCompletedServiceC;
const showServiceDetailsC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.showServiceDetailsF)(req, res);
});
exports.showServiceDetailsC = showServiceDetailsC;
const hireFreelancerC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    (0, adminFeatures_1.hireFreelancerF)(req, res);
});
exports.hireFreelancerC = hireFreelancerC;
const showUsersC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    return (0, adminFeatures_1.showUsersF)(req, res);
});
exports.showUsersC = showUsersC;
const sendFreelancerDetailsC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    return (0, adminFeatures_1.sendFreelancerDetailsF)(req, res);
});
exports.sendFreelancerDetailsC = sendFreelancerDetailsC;
const sendFreelancerProposalsC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    return (0, adminFeatures_1.sendFreelancerProposalsF)(req, res);
});
exports.sendFreelancerProposalsC = sendFreelancerProposalsC;
const changeUserRoleC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    const newRole = req.body.role;
    const userId = req.body.user;
    return (0, adminFeatures_1.changeUserRoleF)(req, res, userId, newRole);
});
exports.changeUserRoleC = changeUserRoleC;
const addNewUsersC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    return (0, adminFeatures_1.addNewUsersF)(req, res);
});
exports.addNewUsersC = addNewUsersC;
const deleteUserC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    const id = req.params.id;
    return (0, adminFeatures_1.deleteUserF)(req, res, id);
});
exports.deleteUserC = deleteUserC;
const showSecretCodesC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    return (0, adminFeatures_1.showSecretCodesF)(req, res);
});
exports.showSecretCodesC = showSecretCodesC;
const deleteSecretCodeC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    const id = req.params.id;
    return (0, adminFeatures_1.deleteSecretCodeF)(req, res, id);
});
exports.deleteSecretCodeC = deleteSecretCodeC;
const createSecretCodeC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = yield (0, auth_1.checkAdministrator)(req, res);
    if (!adminUser) {
        console.error('error while checking if user is an administrator at adminController.ts');
        return res.status(401).json({ message: 'Error while checking admin user at adminController.ts' });
    }
    return (0, adminFeatures_1.createSecretCodeF)(req, res);
});
exports.createSecretCodeC = createSecretCodeC;
