import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
import { PASSWORD_IS_NOT_CORRECT } from './constant/errors';
import { compareHash } from 'src/lib/hash-password/compareHash';
import { UserService } from '../user/user.service';
import { OTPService } from '../otp/otp.service';
import { userNotFound } from '../user/constants/userErrorMessages';
@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private otpService: OTPService,
  ) {}

  async createUser(data: AuthCredentialsDto) {
    const potentialUser = await this.userService.findOne({
      email: data.email,
    });
    if (potentialUser) {
      throw new ConflictException('User already exist');
    }
    const user = await this.userService.createOne(data);
    const otp = await this.otpService.createOne(user.id);
    await this.otpService.sendEmail(data.email, otp.code);
    return user;
  }
  async verifyUser({ email, password }: AuthCredentialsDto) {
    const user = await this.userService.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException(userNotFound(email));
    }
    const compared = await compareHash(user.hash, password);
    if (!compared) {
      throw new NotFoundException(PASSWORD_IS_NOT_CORRECT);
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
    const { user } = await this.otpService.verifyOTP({ email, code });
    const verifiedUser = await this.userService.verify(user.id);

    const userDto = UserDto.create(verifiedUser);

    const { access_token, refresh_token } = await this.tokenService.issueTokens(
      userDto,
    );

    return {
      user: userDto,
      access_token,
      refresh_token,
    };
  }
}
