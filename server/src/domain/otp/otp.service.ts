import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/clients/prisma/prisma.client';
import { transporter } from 'src/services/nodemailer/client';
import { UserService } from '../user/user.service';
import { generateCode } from 'src/services/session/generate-code';
import { userNotFound } from '../user/constants/userErrorMessages';
import { VerifyOTPDto } from './dto/dto';
import { CODE_IS_INVALID, OTP_CODE_IS_NOT_FOUND } from './infrastructure/constants/errors';
import {
  badRequestException,
  invalid,
  notFoundException,
  not_found,
} from 'src/services/err/errors';
import { OTPRepository } from './infrastructure/repository/otp.repository';

@Injectable()
export class OTPService {
  constructor(
    private userService: UserService,
    private otpRepository: OTPRepository
  ) {}
  deletByUserId(userId: string) {
    return this.otpRepository.deleteByUserId(userId);
  }
  create(user_id: string) {
    const code = generateCode();
    return this.otpRepository.create(code, user_id);
  }

  findByUserId(user_id: string) {
    return this.otpRepository.findByUserId(user_id);
  }
  sendEmail(email: string, token: string) {
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
  }
  async resendOTP(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw notFoundException({
        description: userNotFound(email),
        error: not_found,
      });
    }
    await this.deletByUserId(user.id);
    const otp = await this.create(user.id);
    if (!otp.code) {
      throw Error('Error occured');
    }
    await this.sendEmail(email, otp.code);
    return;
  }

  async verifyOTP({ email, code: inputCode }: VerifyOTPDto) {
    const result = await this.otpRepository.findByUserEmail({ email, code: inputCode })
    if(!result) return null
    const { code, user } = result

    if (!user) {
      throw notFoundException({
        description: userNotFound(email),
        error: not_found,
      });
    }
    if (!code) {
      throw notFoundException({
        description: OTP_CODE_IS_NOT_FOUND,
        error: not_found,
      });
    }
    const isValid = inputCode === code;
    if (!isValid) {
      throw badRequestException({
        description: CODE_IS_INVALID,
        error: invalid,
      });
    }
    await this.deletByUserId(user.id);

    return {
      user,
      code,
    };
  }
}
