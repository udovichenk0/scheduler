import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthCredentialsDto } from './dto/auth.dto';
import { encryptPassword } from 'src/lib/hash-password/encrypt';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

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
    const { access_token, refresh_token } = await this.tokenService.issueTokens(
      UserDto.create(user),
    );
    return {
      user,
      access_token,
      refresh_token,
    };
  }
}
