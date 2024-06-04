import readlineSync from 'readline-sync';
import bcrypt from 'bcryptjs';
import { User } from "../src/models/User"; 
import { connectDb } from '../config/database';

connectDb();
const createAdmin = async () => {
  const firstName = readlineSync.question('First Name: ');
  const lastName = readlineSync.question('Last Name: ');
  const email = readlineSync.questionEMail('Email: ');
  const password = readlineSync.questionNewPassword('Password: ', {
    min: 8,
    max: 20,
    confirmMessage: 'Confirm Password: '
  });

  const hasedPassword = await bcrypt.hash(password, 10);
  const adminUser = new User({
    firstName : firstName,
    lastName : lastName,
    email : email,
    password: hasedPassword,
    role: 'administrator'
  })
  try {
    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error('error while creating administrator user at createAdmin.ts', err);
  } finally {
    process.exit(0);
  }
};

createAdmin();