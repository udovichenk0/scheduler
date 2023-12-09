import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  Param,
  Delete,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TokenGuard } from '../token/guards/token-guard';
import { TaskService } from './task.service';
import { Request } from 'express';
import { UserDto } from '../user/dto/user.dto';
import {
  CreateManyTasksCredentialDto,
  CreateTaskCredentialDto,
  TaskDto,
  TaskIdSchema,
  TestDto,
  UpdateDateCredentialsDto,
  UpdateStatusCredentialDto,
} from './dto/task.dto';
import { UseZodGuard, ZodValidationPipe } from 'nestjs-zod';

@Controller('tasks')
@UseGuards(TokenGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get()
  async getTasks(@Req() req: Request) {
    const user = req.session['user'] as UserDto;
    const tasks = await this.taskService.findMany({ id: user.id });
    return tasks;
  }

  @Post()
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
  @Patch(':id')
  @UseZodGuard('body', TestDto)
  @UseZodGuard('params', TaskIdSchema)
  async updateTask(@Body() data: TestDto, @Param('id') id: string) {
    const updatedTask = await this.taskService.updateOne(data, id);
    return TaskDto.create(updatedTask);
  }

  @Post(':id/status')
  @UseZodGuard('params', TaskIdSchema)
  @UseZodGuard('body', UpdateStatusCredentialDto)
  async updateStatus(
    @Body() data: UpdateStatusCredentialDto,
    @Param('id') id: string,
  ) {
    const task = await this.taskService.updateOne(data, id);
    return TaskDto.create(task);
  }

  @Patch(':id/date')
  @UseZodGuard('params', TaskIdSchema)
  @UseZodGuard('body', UpdateDateCredentialsDto)
  async updateDate(
    @Body() data: UpdateDateCredentialsDto,
    @Param('id') id: string,
  ) {
    const task = await this.taskService.updateOne(data, id);
    return TaskDto.create(task);
  }

  @Delete(':id')
  @UseZodGuard('params', TaskIdSchema)
  async deleteTask(@Param('id') id: string) {
    const task = await this.taskService.deleteOne(id);
    return task;
  }
  @Post('batch')
  @UsePipes(CreateManyTasksCredentialDto)
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

  @Patch(':id/trash')
  @UseZodGuard('params', TaskIdSchema)
  async trash(@Param('id') id: string) {
    const task = await this.taskService.updateOne({ is_deleted: true }, id);
    return TaskDto.create(task);
  }
}
