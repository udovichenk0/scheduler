import { Injectable } from '@nestjs/common';
import { RefreshService } from './refreshToken/refresh.service';
import { UserDto } from '../user/dto/user.dto';
import { JWTService } from './jwtToken/jwt.service';
import { USER_IS_NOT_AUTHORIZED } from './constant/errors';
import { UserService } from '../user/user.service';
import {
  unauthorized,
  unauthorizedException,
} from 'src/services/err/errors';
@Injectable()
export class TokenService {
  constructor(
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
  async refresh(refreshToken: string, session: Record<string, any>) {
    if (!refreshToken) {
      return null;
    }
    const userData = await this.refreshService.verifyRefresh(refreshToken);
    if (!userData) {
      session['refresh_token'] = null;
      throw unauthorizedException({
        description: USER_IS_NOT_AUTHORIZED,
        error: unauthorized,
      });
    }
    const user = await this.userService.findOne({ id: userData.id });
    const { access_token } = await this.issueTokens(UserDto.create(user));
    return {
      access_token,
      userData,
    };
  }
}
