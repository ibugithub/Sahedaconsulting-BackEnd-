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
const readline_sync_1 = __importDefault(require("readline-sync"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../src/models/User");
const database_1 = require("../config/database");
(0, database_1.connectDb)();
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = readline_sync_1.default.question('First Name: ');
    const lastName = readline_sync_1.default.question('Last Name: ');
    const email = readline_sync_1.default.questionEMail('Email: ');
    const password = readline_sync_1.default.questionNewPassword('Password: ', {
        min: 8,
        max: 20,
        confirmMessage: 'Confirm Password: '
    });
    const hasedPassword = yield bcryptjs_1.default.hash(password, 10);
    const adminUser = new User_1.User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hasedPassword,
        role: 'administrator'
    });
    try {
        yield adminUser.save();
        console.log('Admin user created successfully');
    }
    catch (err) {
        console.error('error while creating administrator user at createAdmin.ts', err);
    }
    finally {
        process.exit(0);
    }
});
createAdmin();
