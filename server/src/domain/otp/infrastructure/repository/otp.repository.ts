import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/clients/prisma/prisma.client";
// import { Confirmation, VerifyOTPDto } from './dto/dto';

type Confirmation = {
  code: string;
  email: string;
  id: string;
  verified: boolean;
  created_at: Date;
  hash: string;
};
@Injectable()
export class OTPRepository {
  constructor(private prismaService: PrismaService) {}
  deleteByUserId(id: string) {
    return this.prismaService.emailConfirmation.delete({
      where: {
        user_id: id
      }
    });
  }
  create(code: string, user_id: string) {
    return this.prismaService.emailConfirmation.create({
      data: {
        user_id,
        code
      }
    });
  }

  findByUserId(user_id: string) {
    return this.prismaService.emailConfirmation.findUnique({
      where: {
        user_id
      }
    });
  }

  async findByUserEmail(data: { email: string; code: string }) {
    const { email } = data;
    const res = await this.prismaService.$queryRaw<Confirmation[]>`
      SELECT code, user.* FROM emailConfirmation e JOIN user ON e.user_id = user.id WHERE user.email = ${email};`;
    const { code, ...user } = res[0];

    if (!code || !user) return null;

    return {
      code,
      user
    };
  }
}
