import { Controller, Get, Req } from '@nestjs/common';
import { TokenService } from './token.service';
import { Request } from 'express';

@Controller()
export class TokenController {
  constructor(private tokenService: TokenService) {}
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.session['refresh_token'];
    return await this.tokenService.refresh(refreshToken);
  }
}
