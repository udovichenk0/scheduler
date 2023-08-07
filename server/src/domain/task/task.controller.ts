import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TokenGuard } from '../token/guards/token-guard';
import { TaskService } from './task.service';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.dto';
import {
  CreateManyTasksCredentialDto,
  CreateTaskCredentialDto,
  DeleteTaskCredentialsDto,
  TaskDto,
  UpdateStatusCredentialDto,
  UpdateTaskCredentialDto,
} from './dto/task.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('tasks')
@UseGuards(TokenGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get('get')
  async getTasks(@Req() req: Request) {
    const user = req.session['user'] as UserDto;
    const tasks = await this.taskService.findMany({ id: user.id });
    return tasks;
  }
  @Post('create')
  @UsePipes(new ZodValidationPipe(CreateTaskCredentialDto))
  async createTask(
    @Req() req: Request,
    @Body() taskCredentials: CreateTaskCredentialDto,
  ) {
    const user = req.session['user'] as UserDto;
    const task = await this.taskService.createOne({
      id: uuidv4(),
      ...taskCredentials,
      user: {
        connect: {
          id: user.id,
        },
      },
    });
    return TaskDto.create(task);
  }
  @Post('update')
  async updateTask(@Body() taskCredentials: UpdateTaskCredentialDto) {
    const { id, ...credentials } = taskCredentials;
    const task = await this.taskService.updateOne({
      data: credentials,
      where: {
        id,
      },
    });
    return TaskDto.create(task);
  }
  @Post('update-status')
  @UsePipes(new ZodValidationPipe(UpdateStatusCredentialDto))
  async updateStatus(@Body() taskCredentials: UpdateStatusCredentialDto) {
    const { status, id } = taskCredentials;
    const task = await this.taskService.updateStatus({
      data: {
        status,
      },
      where: {
        id,
      },
    });
    return task;
  }
  @Post('delete')
  @UsePipes(new ZodValidationPipe(DeleteTaskCredentialsDto))
  async deleteTask(@Body() taskCredentials: DeleteTaskCredentialsDto) {
    const { id } = taskCredentials;
    const task = await this.taskService.deleteOne({
      where: {
        id,
      },
    });
    return task;
  }
  @Post('create-many')
  async createMany(@Body() taskCredentials: CreateManyTasksCredentialDto) {
    const { user_id, tasks } = taskCredentials;
    const response = await this.taskService.createMany({
      user_id,
      data: tasks,
    });
    return response;
  }
}
