import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.dto';

@Controller('auth')
@UsePipes(AuthCredentialsDto)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async Signup(@Body() body: AuthCredentialsDto) {
    // const user = await this.authService.createUser({
    //     email: body.email,
    //     hash
    // })
    return 'signup';
  }
  @Post('sign-in')
  async Signin() {
    return 'signin';
  }
}
