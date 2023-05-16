import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthCredentialsDto } from './dto/auth.dto';
import { encryptPassword } from 'src/lib/hash-password/encrypt';
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async createUser(credentials: AuthCredentialsDto) {
    const potentialUser = await this.prismaService.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (potentialUser) {
      throw new ConflictException('User already exist');
    }
    const hash = await encryptPassword(credentials.password);
    const user = this.prismaService.user.create({
      data: {
        email: credentials.email,
        hash,
      },
    });
    return user;
  }
}
