import { Controller, Get } from '@nestjs/common';
import { JWTService } from './jwtToken/jwt.service';
import { TokenService } from './token.service';

@Controller()
export class TokenController {
  constructor(
    private jwtService: JWTService,
    private tokenService: TokenService,
  ) {}
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
  @Get('refresh')
  async refresh() {
    return await this.tokenService.refresh(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXNkaWZqcyIsImlhdCI6MTY4NDQ3OTExMSwiZXhwIjoxNjg0NDc5MTMxfQ.h_CXE0lwj_3URelvUECLjOr5EeeZlQBHdqvD11kg-g8',
    );
  }
}
