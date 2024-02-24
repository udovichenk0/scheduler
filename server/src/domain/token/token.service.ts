import { Injectable } from '@nestjs/common';
import { RefreshService } from './refreshToken/refresh.service';
import { UserDto } from '../user/dto/user.dto';
import { JWTService } from './jwtToken/jwt.service';
import { UserService } from '../user/user.service';
import {
  Errors,
  isError,
} from 'src/services/err/errors';
@Injectable()
export class TokenService {
  constructor(
    private refreshService: RefreshService,
    private userService: UserService,
    private jwtService: JWTService,
  ) {}

  issueTokens(userData: UserDto) {
    const access_token = this.jwtService.signToken(userData);
    const refresh_token = this.refreshService.signRefresh(userData);
    return {
      access_token,
      refresh_token,
    };
  }
  async refresh(refreshToken: string, session: Record<string, any>) {
    try {
      const userData = this.refreshService.verifyRefresh(refreshToken);
      if (isError(userData)) {
        session['refresh_token'] = null;
        return Errors.Unauthorized()
      }
      
      const user = await this.userService.findById(userData.id);
      if(isError(user)) return user
      const { access_token } = this.issueTokens(UserDto.create(user));
      return {
        access_token,
        userData,
      };
    } catch (error) {
      return Errors.InternalServerError() 
    }
  }
}
