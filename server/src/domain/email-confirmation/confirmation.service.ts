import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { transporter } from 'src/nodemailer';

@Injectable()
export class ConfirmationService {
  constructor(private prismaService: PrismaService) {}
  deleteOne(id: string) {
    return this.prismaService.emailConfirmation.delete({
      where: {
        user_id: id,
      },
    });
  }
  createOne(data: { code: string; user_id: string }) {
    return this.prismaService.emailConfirmation.create({
      data,
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
}
