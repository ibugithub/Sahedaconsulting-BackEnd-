import express from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import freelancerRoutes from './routes/freelancerRoutes';
import buyerRoutes from './routes/buyerRoutes';
import loggerMiddleWare from './middlewares/loggerMiddleware';
import { connectDb } from '../config/database';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors'
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

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
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("\n \n +++ uploadsdir has been created +++ \n \n")
} else {
  console.log(' \n \n uploadsdir already exists!!! \n \n')
}

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/freelancer', freelancerRoutes);
app.use('/api/buyer', buyerRoutes);

const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.TRUSTED_ORIGINS?.split(','),
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.set('socketio', io);

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});