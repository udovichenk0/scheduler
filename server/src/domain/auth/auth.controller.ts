import { Body, Controller, Post, Req, UsePipes, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthDto } from './dto/auth.dto';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  @UsePipes(AuthCredentialsDto)
  async Signup(
    @Body() body: AuthCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const data = await this.authService.createUser(body);
    session.refresh_token = data.refresh_token;
    return AuthDto.create(data);
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
  async Logout(@Session() session: Record<string, any>) {
    session['refresh_token'] = null;
    return;
  }
}
