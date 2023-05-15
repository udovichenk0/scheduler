import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  findOne({ email }: { email: string }) {
    const user = this.prismaService.user.findMany();
    return user;
  }
}
