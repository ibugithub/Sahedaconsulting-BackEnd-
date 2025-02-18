import express, {Request} from "express";
import multer from "multer";
import {serviceUploadC, showServiceC, updateServiceC, deleteServiceC, showHiredServiceC, showCompletedServiceC, markCompletedC, markHiredC, showServiceDetailsC, hireFreelancerC, showUsersC, sendFreelancerDetailsC, sendFreelancerProposalsC, changeUserRoleC, addNewUsersC, deleteUserC, showSecretCodesC, createSecretCodeC, deleteSecretCodeC} from "../controllers/adminController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *1E9);
    cb(null, file.fieldname + '-' +  uniqueSuffix + '-' + file.originalname)
  }
})
const filterFile = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean)=> void) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(new Error("Only JPEG files are supported"), false)
  }
}
export const upload = multer({storage: storage, fileFilter: filterFile})
router.post('/upload', upload.single('image'), serviceUploadC);
router.get('/showServices', showServiceC);
router.put('/edit/:id', upload.single('imgFile'), updateServiceC);
router.delete('/del/:id', deleteServiceC);
router.get('/markHired/:id', markHiredC);
router.get('/markCompleted/:id', markCompletedC);
router.get('/hiredServices', showHiredServiceC);
router.get('/completedServices', showCompletedServiceC);
router.get('/serviceDetails/:id', showServiceDetailsC);
router.post('/hireFreelancer', hireFreelancerC);
router.get('/showUsers', showUsersC);
router.post('/sendFreelancerDetails', sendFreelancerDetailsC);
router.post('/sendFreelancerProposals', sendFreelancerProposalsC);
router.put('/changeUserRole', changeUserRoleC);
router.post('/addUser', addNewUsersC);
router.delete('/deleteUser/:id', deleteUserC);
router.get('/showSecretCodes', showSecretCodesC);
router.post('/createSecretCode', createSecretCodeC);
router.delete('/deleteSecretCode/:id', deleteSecretCodeC);
export default router;