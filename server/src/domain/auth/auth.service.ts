import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
import {
  CODE_IS_NOT_VALID,
  PASSWORD_IS_NOT_CORRECT,
  userNotFound,
} from './constant/authErrorMessages';
import { compareHash } from 'src/lib/hash-password/compareHash';
import { UserService } from '../user/user.service';
import { randomCode } from 'src/lib/random-code';
import { ConfirmationService } from '../email-confirmation/confirmation.service';
@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
  ) {}

  async createUser(data: AuthCredentialsDto) {
    const potentialUser = await this.userService.findOne({
      email: data.email,
    });
    if (potentialUser) {
      throw new ConflictException('User already exist');
    }
    const code = randomCode();
    const user = await this.userService.createOne(data);
    await this.confirmationService.createOne({ code, user_id: user.id });
    await this.confirmationService.sendEmail(data.email, code);
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
    const user = await this.userService.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException(userNotFound(email));
    }
    const confirmation = await this.confirmationService.findOne(user.id);
    if (!confirmation) {
      throw new NotFoundException(userNotFound(email));
    }
    const isValid = confirmation.code === code;
    if (!isValid) {
      throw new NotAcceptableException(CODE_IS_NOT_VALID);
    }
    const verifiedUser = await this.userService.verify(user.id);
    await this.confirmationService.deleteOne(verifiedUser.id);
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
