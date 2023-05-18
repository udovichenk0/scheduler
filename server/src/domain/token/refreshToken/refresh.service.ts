import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from 'src/database/prisma.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UserDto } from 'src/domain/user/dto/user.dto';
@Injectable()
export class RefreshService {
  constructor(private prismaService: PrismaService) {}
  async signRefresh(payload: UserDto) {
    return payload;
    // const user = await this.prismaService.user.findUnique({
    //   where: { id: userId },
    // });
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    // const token = randomStringGenerator();
    // await this.prismaService.refreshToken.create({
    //   data: {
    //     token,
    //     userId,
    //   },
    // });

    // return token;
  }
  async validate(userId: number) {
    const token = await this.prismaService.refreshToken.findUnique({
      where: {
        userId,
      },
      // include: {
      //   user: true,
      // },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return token;
  }
}
