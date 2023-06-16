import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TokenGuard } from '../token/guards/token-guard';
import { TaskService } from './task.service';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.dto';
import { TaskCredentialDto, TaskDto } from './dto/task.dto';
import { ZodValidationPipe } from 'nestjs-zod';

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
  @UsePipes(new ZodValidationPipe(TaskCredentialDto))
  async createTask(
    @Req() req: Request,
    @Body() taskCredentials: TaskCredentialDto,
  ) {
    const user = req.session['user'] as UserDto;
    const task = await this.taskService.createOne({
      ...taskCredentials,
      user: {
        connect: {
          id: user.id,
        },
      },
    });
    return TaskDto.create(task);
  }
  @Post('update-task')
  async updateTask(
    @Req() req: Request,
    @Body() taskCredentials: TaskCredentialDto & { id: number },
  ) {
    const task = await this.taskService.updateOne({
      id: taskCredentials.id,
      data: taskCredentials,
    });
    return TaskDto.create(task);
  }
}
