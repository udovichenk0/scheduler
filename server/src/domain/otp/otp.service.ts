import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/services/clients/prisma/prisma.client';
import { transporter } from 'src/services/nodemailer/client';
import { UserService } from '../user/user.service';
import { generateCode } from 'src/services/session/generate-code';
import { userNotFound } from '../user/constants/userErrorMessages';
import { Confirmation, VerifyOTPDto } from './dto/dto';
import { CODE_IS_INVALID, OTP_CODE_IS_NOT_FOUND } from './constants/errors';
import {
  badRequestException,
  invalid,
  notFoundException,
  not_found,
} from 'src/services/err/errors';
import { User, UserSchema } from '../user/dto/user.dto';
import { z } from 'zod';

@Injectable()
export class OTPService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  deleteOne(id: string) {
    return this.prismaService.emailConfirmation.delete({
      where: {
        user_id: id,
      },
    });
  }
  createOne(user_id: string) {
    const code = generateCode();
    return this.prismaService.emailConfirmation.create({
      data: {
        user_id,
        code,
      },
    });
  }

  findOne(user_id: string) {
    return this.prismaService.emailConfirmation.findUnique({
      where: {
        user_id,
      },
    });
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
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw notFoundException({
        description: userNotFound(email),
        error: not_found,
      });
    }
    await this.deleteOne(user.id);
    const otp = await this.createOne(user.id);
    if (!otp.code) {
      throw Error('Error occured');
    }
    await this.sendEmail(email, otp.code);
    return;
  }

  async verifyOTP({ email, code }: VerifyOTPDto) {
    const res = await this.prismaService.$queryRaw<Confirmation[]>`
      SELECT code, user.* FROM emailConfirmation e JOIN user ON e.user_id = user.id WHERE user.email = ${email};`

    const confirmation = res[0]

    const user = User.create(confirmation)
    const confirmationCode = confirmation.code

    if (!user) {
      throw notFoundException({
        description: userNotFound(email),
        error: not_found,
      });
    }
    if (!confirmationCode) {
      throw notFoundException({
        description: OTP_CODE_IS_NOT_FOUND,
        error: not_found,
      });
    }
    const isValid = confirmationCode === code;
    if (!isValid) {
      throw badRequestException({
        description: CODE_IS_INVALID,
        error: invalid,
      });
    }
    await this.deleteOne(user.id);

    return {
      user,
      confirmation,
    };
  }
}
