import { UserDto } from './../user/dto/user.dto';
import { Body, Controller, Post, Req, UsePipes, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthDto } from './dto/auth.dto';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  @UsePipes(AuthCredentialsDto)
  async Signup(@Body() body: AuthCredentialsDto) {
    const data = await this.authService.createUser(body);
    return UserDto.create(data);
  }
  @Post('sign-in')
  @UsePipes(AuthCredentialsDto)
  async Signin(
    @Body() body: AuthCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const data = await this.authService.verifyUser(body);
    session.refresh_token = data.refresh_token;
    return AuthDto.create(data);
  }
  @Post('logout')
  async logout(@Req() req: Request) {
    req.session['refresh_token'] = null;
    return { message: 'The user session has ended' };
  }
  @Post('verify-email')
  async verifyEmail(
    @Body() creds: { code: string; email: string },
    @Session() session: Record<string, any>,
  ) {
    const { code, email } = creds;
    const verified = await this.authService.verifyEmail({ code, email });
    session.refresh_token = verified.refresh_token;
    return AuthDto.create(verified);
  }
  @Post('resend')
  async resend(@Body() data: { email: string }) {
    await this.authService.resendEmail(data.email);
    return {
      message: 'Confirmation code was sent.',
    };
  }
}
