import { Controller, Get, Req, Session } from "@nestjs/common";
import { TokenService } from "./token.service";
import { Request } from "express";
import { handleError, isError } from "src/services/err/errors";

@Controller()
export class TokenController {
  constructor(private tokenService: TokenService) {}
  @Get("refresh")
  async refresh(@Req() req: Request, @Session() session: Record<string, any>) {
    const refreshToken = req.session["refresh_token"];
    const result = await this.tokenService.refresh(refreshToken, session);
    if (isError(result)) {
      return handleError(result);
    }
    return result;
  }
}
