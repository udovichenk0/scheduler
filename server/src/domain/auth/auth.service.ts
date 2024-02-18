import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
import { PASSWORD_NOT_CORRECT, USER_EXISTS } from './infrastructure/constant/errors';
import { compareHash } from 'src/services/session/compare-hash';
import { UserService } from '../user/user.service';
import { OTPService } from '../otp/otp.service';
import { userNotFound } from '../user/constants/userErrorMessages';
import {
  badRequestException,
  conflict,
  conflictException,
  invalid,
  notFoundException,
  not_found,
} from 'src/services/err/errors';
@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private otpService: OTPService,
  ) {}

  async createUser(data: AuthCredentialsDto) {
    const potentialUser = await this.userService.findByEmail(data.email);
    if (potentialUser) {
      throw conflictException({
        description: USER_EXISTS,
        error: conflict,
      });
    }
    const user = await this.userService.createOne(data);
    const otp = await this.otpService.create(user.id);
    await this.otpService.sendEmail(data.email, otp.code);
    return user;
  }
  async verifyUser({ email, password }: AuthCredentialsDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw notFoundException({
        description: userNotFound(email),
        error: not_found,
      });
    }
    const compared = await compareHash(user.hash, password);
    if (!compared) {
      throw badRequestException({
        description: PASSWORD_NOT_CORRECT,
        error: invalid,
      });
    }
    const userDto = UserDto.create(user);
    const { access_token, refresh_token } = await this.tokenService.issueTokens(
      UserDto.create(userDto),
    );
    return {
      user: userDto,
      access_token,
      refresh_token,
    };
  }
  async verifyEmail({ code, email }: { code: string; email: string }) {
    const result = await this.otpService.verifyOTP({ email, code });
    if(!result) return null
    const verifiedUser = await this.userService.verify(result.user.id);

    const userDto = UserDto.create(verifiedUser);
    const { access_token, refresh_token } = await this.tokenService.issueTokens(
      userDto
    );

    return {
      user: userDto,
      access_token,
      refresh_token,
    };
  }
}
