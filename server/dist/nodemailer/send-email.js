"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const _1 = require(".");
const sendEmail = async (email, token) => {
    const info = await _1.transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `<h1>${token}</h1>`,
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
        return info;
    });
    return info;
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=send-email.js.map