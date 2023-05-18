import { Controller, Get } from '@nestjs/common';
import { JWTService } from './jwtToken/jwt.service';

@Controller()
export class TokenController {
  constructor(private jwtService: JWTService) {}
  @Get('token')
  async getToken() {
    const user = {
      id: 1,
      email: 'fiosof@gmail.com',
      verified: true,
    };
    const token = await this.jwtService.signToken(user);
    return token;
  }
}
