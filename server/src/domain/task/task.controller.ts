import {
  Body,
  Controller,
  Get,
  Patch,
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
  UpdateDateCredentialsDto,
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
  async createTask(@Req() req: Request, @Body() body: CreateTaskCredentialDto) {
    const user = req.session['user'] as UserDto;
    const task = await this.taskService.createOne({
      id: uuidv4(),
      ...body,
      user: {
        connect: {
          id: user.id,
        },
      },
    });
    return TaskDto.create(task);
  }
  @Post('update')
  @UsePipes(new ZodValidationPipe(UpdateTaskCredentialDto))
  async updateTask(@Body() body: UpdateTaskCredentialDto) {
    const { id, task } = body;
    const updatedTask = await this.taskService.updateOne({
      data: task,
      where: {
        id,
      },
    });
    return TaskDto.create(updatedTask);
  }
  @Post('update-status')
  @UsePipes(new ZodValidationPipe(UpdateStatusCredentialDto))
  async updateStatus(@Body() body: UpdateStatusCredentialDto) {
    const { status, id } = body;
    const task = await this.taskService.updateStatus({
      data: {
        status,
      },
      where: {
        id,
      },
    });
    return TaskDto.create(task);
  }
  @Patch('update-date')
  async updateDate(@Body() body: UpdateDateCredentialsDto) {
    const task = await this.taskService.updateOne({
      data: {
        start_date: body.date,
      },
      where: {
        id: body.id,
      },
    });
    return TaskDto.create(task);
  }
  @Post('delete')
  @UsePipes(new ZodValidationPipe(DeleteTaskCredentialsDto))
  async deleteTask(@Body() body: DeleteTaskCredentialsDto) {
    const { id } = body;
    const task = await this.taskService.deleteOne({
      where: {
        id,
      },
    });
    return task;
  }
  @Post('create-many')
  async createMany(
    @Body() data: CreateManyTasksCredentialDto,
    @Req() req: Request,
  ) {
    const user = req.session['user'] as UserDto;
    const tasks = data.tasks;
    const response = await this.taskService.createMany({
      user_id: user.id,
      data: tasks,
    });
    return response;
  }
  @Post('trash')
  @UsePipes(new ZodValidationPipe(DeleteTaskCredentialsDto))
  async trash(@Body() body: DeleteTaskCredentialsDto) {
    const { id } = body;
    const task = await this.taskService.trashOne(id);
    return TaskDto.create(task);
  }
}
