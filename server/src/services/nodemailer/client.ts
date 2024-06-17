import { Injectable } from "@nestjs/common";
import { Errors } from "../err/errors";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");

@Injectable()
export class EmailTransporter {
  async sendEmail({
    to,
    code,
    subject
  }: {
    to: string;
    code: string;
    subject: string;
  }) {
    try {
      await nodemailer
        .createTransport({
          service: "gmail",
          port: 465,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        })
        .sendMail({
          from: process.env.EMAIL,
          to,
          subject,
          html: `<h1>${code}</h1>`
        });
    } catch (error) {
      console.log(error);
      return Errors.InternalServerError();
    }
  }
}
