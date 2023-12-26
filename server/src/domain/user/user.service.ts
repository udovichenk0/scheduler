import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { encryptPassword } from 'src/lib/hash-password/encrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async findOne(where: Prisma.userWhereUniqueInput) {
    const user = await this.prismaService.user.findUnique({
      where,
    });
    if (user && user.verified) {
      return user;
    }
    //todo do smth with it
    if (user && !user.verified) {
      await this.deleteOne(user.id);
    }
    return null;
  }
  async createOne(data: { password: string; email: string }) {
    const hash = await encryptPassword(data.password);
    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        hash,
      },
    });
    return user;
  }
  async deleteOne(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
  async verify(id: string) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });
  }
}
