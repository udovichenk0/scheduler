import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentials } from './dto/user.dto';
@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Get('user')
  @UsePipes(UserCredentials)
  async getUser(@Query('email') email: string) {
    const user = await this.userService.findOne({ email });
    return user;
  }
}
