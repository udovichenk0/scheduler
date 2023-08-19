import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RefreshService } from './refreshToken/refresh.service';
import { UserDto } from '../user/dto/user.dto';
import { JWTService } from './jwtToken/jwt.service';
import {
  tokenNotFound,
  userNotAuthorized,
} from './constant/tokenErrorMessages';
import { UserService } from '../user/user.service';
@Injectable()
export class TokenService {
  constructor(
    private prismaService: PrismaService,
    private refreshService: RefreshService,
    private userService: UserService,
    private jwtService: JWTService,
  ) {}

  async issueTokens(userData: UserDto) {
    const access_token = await this.jwtService.signToken(userData);
    const refresh_token = await this.refreshService.signRefresh(userData);

    return {
      access_token,
      refresh_token,
    };
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      return null;
    }
    const userData = await this.refreshService.verifyRefresh(refreshToken);
    if (!userData) {
      throw new UnauthorizedException(userNotAuthorized);
    }
    const user = await this.userService.findOne({ id: userData.id });
    const { access_token } = await this.issueTokens(UserDto.create(user));
    return {
      access_token,
      userData,
    };
  }
}
