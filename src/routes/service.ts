import express, {Request} from "express";
import multer from "multer";
import {serviceUploadC, showServiceC, updateServiceC, deleteServiceC, trashServiceC, sendMailC } from "../controllers/service";

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
router.get('/trash/:id', trashServiceC);
router.post('/sendMail', sendMailC);
export default router;