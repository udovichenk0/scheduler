import { Injectable } from '@nestjs/common';
import { transporter } from 'src/services/nodemailer/client';
import { UserService } from '../user/user.service';
import { generateCode } from 'src/services/session/generate-code';
import { VerifyOTPDto } from './dto/dto';
import {
  Errors,
  isError,
} from 'src/services/err/errors';
import { OTPRepository } from './infrastructure/repository/otp.repository';

@Injectable()
export class OTPService {
  constructor(
    private userService: UserService,
    private otpRepository: OTPRepository
  ) {}
  deletByUserId(userId: string) {
    try {
      return this.otpRepository.deleteByUserId(userId);
    } catch (error) {
      return Errors.InternalServerError() 
    }
  }
  create(user_id: string) {
    try {
      const code = generateCode();
      return this.otpRepository.create(code, user_id);
    } catch (error) {
      return Errors.InternalServerError() 
    }
  }

  async findByUserId(user_id: string) {
    try {
      const confirmation = await this.otpRepository.findByUserId(user_id);

      if(!confirmation) return Errors.ConfirmationNotFound()

      return confirmation
    } catch (error) {
      return Errors.InternalServerError() 
    }
  }
  sendEmail(email: string, token: string) {
    try {
      return transporter.sendMail(
        {
          from: process.env.EMAIL,
          to: email,
          subject: 'Verify your email',
          html: `<h1>${token}</h1>`,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          }
          return info;
        },
      );
    } catch (error) {
      return Errors.InternalServerError() 
    }
  }
  async resendOTP(email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (isError(user)) return user
      await this.deletByUserId(user.id);

      const otp = await this.create(user.id);
      if(isError(otp)) return otp 
      await this.sendEmail(email, otp.code);
      
    } catch (error) {
      return Errors.InternalServerError()
    }
  }

  async verifyOTP({ email, code: inputCode }: VerifyOTPDto) {
    try {
      const result = await this.otpRepository.findByUserEmail({ email, code: inputCode })
      if(!result) {
        return Errors.ConfirmationNotFound()
      }
      const { code, user } = result
  
      const isValid = inputCode === code;
      if (!isValid) {
        return Errors.GeneralInvalid('Password', code)
      }
      await this.deletByUserId(user.id);
  
      return {
        user,
        code,
      };
    } catch (error) {
      return Errors.InternalServerError()
    }
  }
}
