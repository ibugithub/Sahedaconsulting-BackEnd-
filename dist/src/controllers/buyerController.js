"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailC = void 0;
const sendMail_1 = require("../features/sendMail");
const sendMailC = (req, res) => {
    (0, sendMail_1.sendMailF)(req, res);
};
exports.sendMailC = sendMailC;
//# sourceMappingURL=buyerController.js.map