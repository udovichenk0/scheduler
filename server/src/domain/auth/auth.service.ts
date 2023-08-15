import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { encryptPassword } from 'src/lib/hash-password/encrypt';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/dto/user.dto';
import { passwordNotCorrect, userNotFound } from './constant/authErrorMessages';
import { compareHash } from 'src/lib/hash-password/compareHash';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from 'src/nodemailer/send-email';
import { randomCode } from 'src/lib/random-code';
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
    const code = randomCode();
    const user = await this.prismaService.user.create({
      data: {
        email: credentials.email,
        hash,
        id: uuidv4(),
      },
    });
    await this.prismaService.emailConfirmation.create({
      data: {
        id: uuidv4(),
        code,
        user_id: user.id,
      },
    });
    await sendEmail(credentials.email, code);
    return user;
  }
  async verifyUser(credentials: AuthCredentialsDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new NotFoundException(userNotFound(credentials.email));
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
  async verifyEmail({ code, email }: { code: string; email: string }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
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
    const verifiedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
      },
    });
    await this.prismaService.emailConfirmation.delete({
      where: {
        user_id: verifiedUser.id,
      },
    });
    const { access_token, refresh_token } = await this.tokenService.issueTokens(
      UserDto.create(user),
    );
    return {
      user: verifiedUser,
      access_token,
      refresh_token,
    };
  }
}
