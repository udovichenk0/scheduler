import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthDto } from './dto/auth.dto';

@Controller('auth')
@UsePipes(AuthCredentialsDto)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async Signup(@Body() body: AuthCredentialsDto) {
    const data = await this.authService.createUser(body);
    return AuthDto.create(data);
  }
  @Post('sign-in')
  async Signin() {
    return 'signin';
  }
}
