import { EmailSchema } from "./../user/dto/user.dto";
import { Injectable } from "@nestjs/common";
import { EmailTransporter } from "src/services/nodemailer/client";
import { UserService } from "../user/user.service";
import { generateCode } from "src/services/session/generate-code";
import { VerifyOTPDto } from "./dto/dto";
import { Errors, isError } from "src/services/err/errors";
import { OTPRepository } from "./infrastructure/repository/otp.repository";

@Injectable()
export class OTPService {
  constructor(
    private userService: UserService,
    private otpRepository: OTPRepository,
    private emailTransporter: EmailTransporter
  ) {}
  deletByUserId(userId: string) {
    try {
      if (!userId) {
        return Errors.Missing("User id");
      }
      return this.otpRepository.deleteByUserId(userId);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  create(userId: string) {
    try {
      if (!userId) {
        return Errors.Missing("User id");
      }
      const code = generateCode();
      return this.otpRepository.create(code, userId);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async findByUserId(userId: string) {
    try {
      if (!userId) {
        return Errors.Missing("User id");
      }
      const confirmation = await this.otpRepository.findByUserId(userId);

      if (!confirmation) return Errors.ConfirmationNotFound();

      return confirmation;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  sendEmail({ email, code }: { email: string; code: string }) {
    if (!email) {
      return Errors.Missing("Email");
    }
    if (!EmailSchema.safeParse(email).success) {
      return Errors.GeneralInvalid("Email", email);
    }
    if (!code) {
      return Errors.Missing("Code");
    }
    return this.emailTransporter.sendEmail({
      to: email,
      code,
      subject: "Verify your email"
    });
  }
  async resendOTP(email: string) {
    try {
      if (!email) {
        return Errors.Missing("Email");
      }
      if (!EmailSchema.safeParse(email).success) {
        return Errors.GeneralInvalid("Email", email);
      }
      const user = await this.userService.findByEmail(email);

      if (isError(user)) return user;
      await this.deletByUserId(user.id);

      const otp = await this.create(user.id);
      if (isError(otp)) return otp;
      await this.sendEmail({ email, code: otp.code });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }

  async verifyOTP({ email, code: inputCode }: VerifyOTPDto) {
    try {
      if (!email) {
        return Errors.Missing("Email");
      }
      if (!EmailSchema.safeParse(email).success) {
        return Errors.GeneralInvalid("Email", email);
      }
      if (!inputCode) {
        return Errors.Missing("Code");
      }
      const result = await this.otpRepository.findByUserEmail({
        email,
        code: inputCode
      });
      if (!result) {
        return Errors.ConfirmationNotFound();
      }
      const { code, user } = result;

      const isValid = inputCode === code;
      if (!isValid) {
        return Errors.GeneralInvalid("Code", code);
      }
      await this.deletByUserId(user.id);

      return {
        user,
        code
      };
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
}
