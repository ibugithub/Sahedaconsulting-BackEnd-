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
exports.GenerateSecretCode = void 0;
const User_1 = require("../models/User");
const GenerateSecretCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const createdCode = Math.random().toString(36).substring(2, 15);
    const code = new User_1.secretCode({ code: createdCode });
    yield code.save();
    return code;
});
exports.GenerateSecretCode = GenerateSecretCode;
