import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  findOne(where: Prisma.userWhereUniqueInput) {
    const user = this.prismaService.user.findUnique({
      where,
    });
    return user;
  }
}
