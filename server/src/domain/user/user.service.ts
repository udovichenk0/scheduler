import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async findOne(where: Prisma.userWhereUniqueInput) {
    const user = await this.prismaService.user.findUnique({
      where,
    });
    if (user && user.verified) {
      return UserDto.create(user);
    }
    if (user && !user.verified) {
      await this.prismaService.user.delete({
        where: {
          id: user.id,
        },
      });
    }
    return {};
  }
}
