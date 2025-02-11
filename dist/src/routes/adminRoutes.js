"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const filterFile = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPEG files are supported"), false);
    }
};
exports.upload = (0, multer_1.default)({ storage: storage, fileFilter: filterFile });
router.post('/upload', exports.upload.single('image'), adminController_1.serviceUploadC);
router.get('/showServices', adminController_1.showServiceC);
router.put('/edit/:id', exports.upload.single('imgFile'), adminController_1.updateServiceC);
router.delete('/del/:id', adminController_1.deleteServiceC);
router.get('/markHired/:id', adminController_1.markHiredC);
router.get('/markCompleted/:id', adminController_1.markCompletedC);
router.get('/hiredServices', adminController_1.showHiredServiceC);
router.get('/completedServices', adminController_1.showCompletedServiceC);
router.get('/serviceDetails/:id', adminController_1.showServiceDetailsC);
router.post('/hireFreelancer', adminController_1.hireFreelancerC);
router.get('/showUsers', adminController_1.showUsersC);
router.post('/sendFreelancerDetails', adminController_1.sendFreelancerDetailsC);
router.post('/sendFreelancerProposals', adminController_1.sendFreelancerProposalsC);
router.put('/changeUserRole', adminController_1.changeUserRoleC);
router.post('/addUser', adminController_1.addNewUsersC);
router.delete('/deleteUser/:id', adminController_1.deleteUserC);
router.get('/showSecretCodes', adminController_1.showSecretCodesC);
router.post('/createSecretCode', adminController_1.createSecretCodeC);
router.delete('/deleteSecretCode/:id', adminController_1.deleteSecretCodeC);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map