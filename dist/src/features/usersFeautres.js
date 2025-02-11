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
exports.changePasswordF = exports.saveUserDataF = exports.setImageF = exports.sendProfileDataF = exports.refreshTokenF = exports.loginF = exports.registerF = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../../dotenv");
const User_1 = require("../models/User");
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwtUtils_1 = require("../Utils/jwtUtils");
const User_2 = require("../models/User");
const sendMail_1 = require("./sendMail");
const JWT_SECRET = process.env.JWT_SECRET || "";
const registerF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('the request body is', req.body);
    try {
        const { formData, frontEndDomain } = req.body;
        const { firstName, lastName, email, password, cPassword, role, Code } = formData;
        if (!firstName || !lastName || !email || !password || !cPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password !== cPassword) {
            return res.status(400).json({ error: "password do not match" });
        }
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hasedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.User({
            firstName,
            lastName,
            email,
            password: hasedPassword,
            role: role
        });
        try {
            if (role === 'buyer') {
                const newBuyer = new User_2.Buyer({
                    user: newUser._id,
                    address: '',
                    phone: '',
                    companyName: '',
                    companyDescription: '',
                });
                yield newBuyer.save();
            }
            if (role === 'freelancer') {
                const code = yield User_2.secretCode.findOne({ code: Code });
                if (!code) {
                    return res.status(400).json({ error: "Invalid secret code" });
                }
                const newFreelancer = new User_2.Freelancer({
                    user: newUser._id,
                    skills: [],
                    address: '',
                    phone: '',
                    profileTitle: '',
                    overview: '',
                    employmentHistory: [],
                    proposals: [],
                    hireCount: 0
                });
                yield newFreelancer.save();
                yield code.deleteOne({ code: Code });
            }
        }
        catch (error) {
            console.error('error while creating Buyer or Freelancer account', error);
            return res.status(401).json({ message: 'Error while creating Buyer or Freelancer account', error: error });
        }
        yield newUser.save();
        req.body.type = 'emailVerification';
        req.body.formData = { firstName: firstName, lastName: lastName, email: email };
        req.body.frontEndDomain = frontEndDomain;
        (0, sendMail_1.sendMailF)(req, res);
        res.status(201).json({ message: "User has been registered successfully" });
    }
    catch (error) {
        console.error('Error while registering the user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.registerF = registerF;
const loginF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid Credintails" });
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: "Invalid Credintails" });
        }
        const accessToken = (0, jwtUtils_1.generateAccessToken)({ userId: user.id, email: user.email });
        const refreshToken = (0, jwtUtils_1.generateRefreshToken)({ userId: user.id, email: user.email });
        res.status(200).json({ message: "Login successful", name: user.firstName + user.lastName, email: user.email, accessToken: accessToken, refreshToken: refreshToken });
    }
    catch (error) {
        console.error('Error logging in', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.loginF = loginF;
const refreshTokenF = (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        const decodeToken = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
        const accessToken = (0, jwtUtils_1.generateAccessToken)({ userId: decodeToken.userId, email: decodeToken.email });
        return res.status(200).json({ message: 'New Access Token has been created', accessToken: accessToken });
    }
    catch (err) {
        console.error("error in generating Accesstoken at 'refreshTokenF' at users.ts ", err);
        return res.status(401).json({ message: 'Invalid refresh  token' });
    }
};
exports.refreshTokenF = refreshTokenF;
const sendProfileDataF = (req, res, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data;
        if (user.role === 'freelancer') {
            const freelancer = yield User_2.Freelancer.findOne({ user: user._id }).populate('proposals');
            if (!freelancer) {
                return res.status(404).json({ message: 'Freelancer profile not found' });
            }
            data = {
                id: freelancer._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                skills: freelancer.skills,
                address: freelancer.address,
                phone: freelancer.phone,
                profileTitle: freelancer.profileTitle,
                overview: freelancer.overview,
                employmentHistory: freelancer.employmentHistory,
                proposals: freelancer.proposals.map(p => p._id),
                hireCount: freelancer.hireCount,
                role: user.role,
                isVerified: user.isVerified
            };
        }
        else if (user.role === 'administrator') {
            const administrator = yield User_1.User.findById(user._id);
            if (!administrator) {
                return res.status(404).json({ message: 'admin profile not found' });
            }
            data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                role: user.role,
                isVerified: user.isVerified
            };
        }
        else if (user.role === 'buyer') {
            const buyer = yield User_2.Buyer.findOne({ user: user._id });
            if (!buyer) {
                return res.status(404).json({ message: 'buyer profile not found' });
            }
            data = {
                userId: user._id,
                buyerId: buyer._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                role: user.role,
                address: buyer.address,
                phone: buyer.phone,
                companyName: buyer.companyName,
                companyDescription: buyer.companyDescription,
                isVerified: user.isVerified
            };
        }
        else if (user.role === 'engineeringAdmin' || user.role === 'itAdmin' || user.role === 'managementAdmin') {
            const adminUser = yield User_1.User.findById(user._id);
            if (!adminUser) {
                return res.status(404).json({ message: 'adminUser profile not found' });
            }
            data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                role: user.role,
                isVerified: user.isVerified
            };
        }
        return res.status(200).json({ message: 'Successfully sent the profile data', userInfo: data });
    }
    catch (e) {
        console.error('Error while authenticating user at users.ts', e);
        return res.status(401).json({ message: 'Error while authenticating user at users.ts', error: e });
    }
});
exports.sendProfileDataF = sendProfileDataF;
const setImageF = (req, res, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imagePath = req.file.path.replace(/\\/g, "/");
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };
        try {
            const results = yield cloudinary_1.v2.uploader.upload(imagePath, options);
            user.image = results.public_id;
            yield user.save();
            return res.status(200).json({ message: 'Image has been uploaded successfully', imgPath: results.public_id });
        }
        catch (err) {
            console.error("Error while uploading image on cloudinary at user.ts", err);
        }
        finally {
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
            else {
                console.log('Could not find the file at service.ts');
            }
            const oldImage = req.body.oldImage;
            cloudinary_1.v2.uploader.destroy(oldImage);
        }
    }
    catch (e) {
        console.error('error while authenticating user at users.ts', e);
        return res.status(401).json({ message: 'error while authenticating user at users.ts', error: e });
    }
});
exports.setImageF = setImageF;
const saveUserDataF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userInfo, user } = req.body;
    try {
        user.firstName = userInfo.firstName;
        user.lastName = userInfo.lastName;
        // For Freelancer
        if (user.role === 'freelancer') {
            const freelancer = yield User_2.Freelancer.findById(userInfo._id);
            if (!freelancer) {
                return res.status(404).json({ message: 'freelancer not found at userFeatures.ts' });
            }
            freelancer.profileTitle = userInfo.profileTitle;
            freelancer.overview = userInfo.overview;
            freelancer.phone = userInfo.phone;
            freelancer.address = userInfo.address;
            freelancer.skills = userInfo.skills;
            freelancer.employmentHistory = userInfo.employmentHistory;
            yield user.save();
            yield freelancer.save();
        }
        // For buyer
        if (user.role === 'buyer') {
            const buyer = yield User_2.Buyer.findById(userInfo.buyerId);
            if (!buyer) {
                return res.status(404).json({ message: 'buyer not found at userFeatures.ts' });
            }
            buyer.phone = userInfo.phone;
            buyer.address = userInfo.address;
            buyer.companyName = userInfo.companyName;
            buyer.companyDescription = userInfo.companyDescription;
            yield user.save();
            yield buyer.save();
        }
        // For other
        if (user.role === 'administrator' || user.role === 'engineeringAdmin' || user.role === 'itAdmin' || user.role === 'managementAdmin') {
            // adintional details could be added in the future
            yield user.save();
        }
        return res.status(201).json({ message: "User data has been updated successfully." });
    }
    catch (e) {
        console.error('error while authenticating user at users.ts', e);
        return res.status(401).json({ message: 'error while authenticating user at users.ts', error: e });
    }
});
exports.saveUserDataF = saveUserDataF;
const changePasswordF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword, user } = req.body;
        const isMatched = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        return res.status(201).json({ message: 'Password has been changed successfully' });
    }
    catch (error) {
        console.error('Error while changing password at usersFeatures.ts', error);
        return res.status(500).json({ message: 'Error while changing password at usersFeatures.ts' });
    }
});
exports.changePasswordF = changePasswordF;
//# sourceMappingURL=usersFeautres.js.map