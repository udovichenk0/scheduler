import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
import { passwordNotCorrect, userNotFound } from './constant/authErrorMessages';
import { compareHash } from 'src/lib/hash-password/compareHash';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from 'src/nodemailer/send-email';
import { UserService } from '../user/user.service';
import { randomCode } from 'src/lib/random-code';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
    private userService: UserService,
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
    await this.prismaService.emailConfirmation.create({
      data: {
        id: uuidv4(),
        code,
        user_id: user.id,
      },
    });
    await sendEmail(data.email, code);
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
      throw new NotFoundException(passwordNotCorrect);
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
    const confirmation = await this.prismaService.emailConfirmation.findUnique({
      where: {
        user_id: user.id,
      },
    });
    if (!confirmation) {
      throw new NotFoundException(userNotFound(email));
    }
    const isValid = confirmation.code === code;
    if (!isValid) {
      throw new NotAcceptableException('Code is not valid');
    }
    const verifiedUser = await this.userService.verify(user.id);
    await this.prismaService.emailConfirmation.delete({
      where: {
        user_id: verifiedUser.id,
      },
    });
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
