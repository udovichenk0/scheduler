import { Body, Controller, Post, Req, UsePipes, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthDto } from './dto/auth.dto';
import { Request } from 'express';
@Controller('auth')
@UsePipes(AuthCredentialsDto)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async Signup(
    @Body() body: AuthCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const data = await this.authService.createUser(body);
    session.user = data.refresh_token;
    return AuthDto.create(data);
  }
  @Post('sign-in')
  async Signin(
    @Body() body: AuthCredentialsDto,
    @Session() session: Record<string, any>,
  ) {
    const data = await this.authService.verifyUser(body);
    session.user = data.refresh_token;
    return AuthDto.create(data);
  }
}
