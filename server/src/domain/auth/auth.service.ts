import { Injectable } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth.dto";
import { TokenService } from "../token/token.service";
import { UserDto } from "../user/dto/user.dto";
import { compareHash } from "src/services/session/compare-hash";
import { UserService } from "../user/user.service";
import { OTPService } from "../otp/otp.service";
import { Errors, isError } from "src/services/err/errors";
import { encryptPassword } from "src/services/session/encrypt-password";
@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private otpService: OTPService
  ) {}

  async createUser({ email, password }: AuthCredentialsDto) {
    try {
      const potentialUser = await this.userService.findByEmail(email);
      if (!isError(potentialUser) && potentialUser.id) {
        return Errors.EmailIsTaken(email);
      }
      const hash = await encryptPassword(password);
      const user = await this.userService.createOne({ email, hash });
      if (isError(user)) return user;
      const otp = await this.otpService.create(user.id);

      if (isError(otp)) return otp;
      await this.otpService.sendEmail({ email, code: otp.code });

      return user;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async verifyUser({ email, password }: AuthCredentialsDto) {
    try {
      const user = await this.userService.findByEmail(email);
      if (isError(user)) return user;

      const isValid = await compareHash(user.hash, password);
      if (!isValid) {
        return Errors.GeneralInvalid("Password", password);
      }
      const userDto = UserDto.create(user);
      const { access_token, refresh_token } =
        await this.tokenService.issueTokens(UserDto.create(userDto));

      return {
        user: userDto,
        access_token,
        refresh_token
      };
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async verifyEmail({ code, email }: { code: string; email: string }) {
    try {
      const result = await this.otpService.verifyOTP({ email, code });
      if (isError(result)) {
        return result;
      }

      const verifiedUser = await this.userService.verify(result.user.id);

      const userDto = UserDto.create(verifiedUser);
      const { access_token, refresh_token } =
        this.tokenService.issueTokens(userDto);

      return {
        user: userDto,
        access_token,
        refresh_token
      };
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
}
