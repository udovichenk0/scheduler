import { UserDto } from './dto/user.dto';
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
    return user;
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
  async deleteOne(where: Prisma.userWhereUniqueInput) {
    await this.prismaService.user.delete({
      where,
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
  async findVerifiedUser(where: Prisma.userWhereUniqueInput) {
    const user = await this.findOne(where);
    if (user && user.verified) {
      return UserDto.create(user);
    }
    if (user && !user.verified) {
      await this.deleteOne(where);
    }
    return {
      error: 'not_found',
      message: 'User is not created',
    };
  }
}
