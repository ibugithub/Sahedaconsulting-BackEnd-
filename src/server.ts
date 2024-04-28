import express from 'express';
import userRoutes  from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import loggerMiddleWare from './middlewares/loggerMiddleware';
import { connectDb } from '../config/database';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path';
import fs from 'fs';


const app = express();
app.use(cors(
  {
    origin: process.env.TRUSTED_ORIGINS?.split(','),
    credentials: true
  }
))
app.use(cookieParser());
app.use(loggerMiddleWare)

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("\n \n +++ uploadsdir has been created +++ \n \n")
} else {
  console.log(' \n \n uploadsdir already exists!!! \n \n')
}

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log('*** The given path *** ', path.join(__dirname, '../uploads') )


const dir1 = path.join(__dirname, '../');

fs.readdir(dir1, function (err, files) {
  if (err) {
      return console.log('Unable to scan directory: ' + err);
  } 
  console.log(" <== path.join(__dirname, '../ ==> ", dir1)
  files.forEach(function (file) {
      console.log('files***', file); 
  });
});


const dir2 = path.join(__dirname, '../uploads');

fs.readdir(dir2, function (err, files) {
  if (err) {
      return console.log('Unable to scan directory: ' + err);
  } 
  console.log(" <== path.join(__dirname, '../uploads' ==> ", dir2)
  files.forEach(function (file) {
      console.log('files***', file); 
  });
});


app.use('/api/users', userRoutes);
app.use('/api/prod', productRoutes);


process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});