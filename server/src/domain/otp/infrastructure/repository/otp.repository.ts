import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/clients/prisma/prisma.client";
import { v4 as uuidv4 } from "uuid";

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
    return this.prismaService.confirmation.delete({
      where: {
        user_id: id
      }
    });
  }
  create(code: string, user_id: string) {
    return this.prismaService.confirmation.create({
      data: {
        id: uuidv4(),
        user_id,
        code
      }
    });
  }

  findByUserId(user_id: string) {
    return this.prismaService.confirmation.findUnique({
      where: {
        user_id
      }
    });
  }

  async findByUserEmail(data: { email: string; code: string }) {
    const { email } = data;
    const res = await this.prismaService.$queryRaw<Confirmation[]>`
      SELECT code, user.* FROM confirmation JOIN user ON e.user_id = user.id WHERE user.email = ${email};`;
    const { code, ...user } = res[0];

    if (!code || !user) return null;

    return {
      code,
      user
    };
  }
}
