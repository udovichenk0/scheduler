import { Controller, Get, Header, Req, Session } from '@nestjs/common';
import { TokenService } from './token.service';
import { Request } from 'express';

@Controller()
export class TokenController {
  constructor(private tokenService: TokenService) {}
  @Header('Access-Control-Allow-Credentials', 'true')
  @Header('Access-Control-Allow-Origin', '*')
  @Get('refresh')
  async refresh(@Req() req: Request, @Session() session: Record<string, any>) {
    const refreshToken = req.session['refresh_token'];
    return await this.tokenService.refresh(refreshToken, session);
  }
}
