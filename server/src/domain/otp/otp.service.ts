import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { transporter } from 'src/nodemailer';
import { UserService } from '../user/user.service';
import { randomCode } from 'src/lib/random-code';
import { userNotFound } from '../user/constants/userErrorMessages';
import { VerifyOTPDto } from './dto/dto';
import { CODE_IS_NOT_VALID } from './constants/constants';

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
    const code = randomCode();
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
      throw new NotFoundException(userNotFound(email));
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
    const user = await this.userService.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException(userNotFound(email));
    }
    const confirmation = await this.findOne(user.id);
    if (!confirmation) {
      throw new NotFoundException(userNotFound(email));
    }
    const isValid = confirmation.code === code;
    if (!isValid) {
      throw new NotAcceptableException(CODE_IS_NOT_VALID);
    }
    await this.deleteOne(user.id);

    return {
      user,
      confirmation,
    };
  }
}
