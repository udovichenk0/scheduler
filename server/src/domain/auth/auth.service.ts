import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { encryptPassword } from 'src/lib/hash-password/encrypt';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
import { passwordNotCorrect, userNotFound } from './constant/authErrorMessages';
import { compareHash } from 'src/lib/hash-password/compareHash';
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
    const user = await this.prismaService.user.create({
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

  async verifyUser(credentials: AuthCredentialsDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new NotFoundException(userNotFound(user.id));
    }
    const compared = await compareHash(user.hash, credentials.password);
    if (!compared) {
      throw new NotFoundException(passwordNotCorrect);
    }
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
