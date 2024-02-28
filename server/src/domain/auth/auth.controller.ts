import { UserDto } from "./../user/dto/user.dto";
import { Body, Controller, Post, Req, UsePipes, Session } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto, AuthDto, VerifyEmailDto } from "./dto/auth.dto";
import { Request } from "express";
import { handleError, isError } from "src/services/err/errors";
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("sign-up")
  @UsePipes(AuthCredentialsDto)
  async Signup(@Body() body: AuthCredentialsDto) {
    const user = await this.authService.createUser(body);
    if (isError(user)) {
      return handleError(user);
    }
    return UserDto.create(user);
  }
  @Post("sign-in")
  @UsePipes(AuthCredentialsDto)
  async Signin(
    @Body() body: AuthCredentialsDto,
    @Session() session: Record<string, any>
  ) {
    const user = await this.authService.verifyUser(body);
    if (isError(user)) {
      return handleError(user);
    }
    session.refresh_token = user.refresh_token;
    return AuthDto.create(user);
  }
  @Post("logout")
  async logout(@Req() req: Request) {
    req.session["refresh_token"] = null;
    return { description: "The user session has ended" };
  }
  @Post("verify-email")
  @UsePipes(VerifyEmailDto)
  async verifyEmail(
    @Body() creds: { code: string; email: string },
    @Session() session: Record<string, any>
  ) {
    const user = await this.authService.verifyEmail(creds);
    if (isError(user)) {
      return handleError(user);
    }
    session.refresh_token = user.refresh_token;
    return AuthDto.create(user);
  }
}
