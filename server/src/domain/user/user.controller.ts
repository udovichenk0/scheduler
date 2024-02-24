import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentials } from './dto/user.dto';
import { handleError, isError } from 'src/services/err/errors';
@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Get('user')
  @UsePipes(UserCredentials)
  async getUser(@Query('email') email: string) {
    const result = await this.userService.findVerifiedUserByEmail(email);
    if(isError(result)){
      return handleError(result)
    }
    return result
  }
}
