import { Controller, Get, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../token/guards/token-guard';

@Controller('')
@UseGuards(TokenGuard)
export class TaskController {
  @Get('get-tasks')
  getTasks() {
    return 'work';
  }
}
