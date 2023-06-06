import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../token/guards/token-guard';
import { TaskService } from './task.service';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.dto';

@Controller('')
@UseGuards(TokenGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get('get-tasks')
  async getTasks(@Req() req: Request) {
    const user = req.session['user'] as UserDto;
    const tasks = await this.taskService.findMany({ id: user.id });
    return tasks;
  }
  @Post('create-task')
  async createTask(@Req() req: Request){
    const user = req.session['user'] as UserDto;
  }
}
