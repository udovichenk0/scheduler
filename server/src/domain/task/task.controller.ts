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
  Delete
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { TokenGuard } from "../token/guards/token-guard";
import { TaskService } from "./task.service";
import { Request } from "express";
import { UserDto } from "../user/dto/user.dto";
import {
  CreateTasksDto,
  CreateTaskDto,
  TaskDto,
  TaskIdParam,
  UpdateDateDto,
  UpdateStatusDto,
  TasksDto
} from "./dto/task.dto";
import { UseZodGuard, ZodValidationPipe } from "nestjs-zod";
import { handleError, isError } from "src/services/err/errors";

@Controller("tasks")
@UseGuards(TokenGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get()
  async getTasks(@Req() req: Request) {
    const user = req.session["user"] as UserDto;
    const tasks = await this.taskService.findManyByUserId(user.id);
    if (isError(tasks)) {
      return handleError(tasks);
    }
    return tasks;
  }

  @Post()
  @UseGuards(TokenGuard)
  @UsePipes(new ZodValidationPipe(CreateTaskDto))
  async createTask(@Req() req: Request, @Body() body: CreateTaskDto) {
    const user = req.session["user"] as UserDto;
    const task = await this.taskService.createOne({
      id: uuidv4(),
      ...body,
      user: {
        connect: {
          id: user.id
        }
      }
    });
    if (isError(task)) {
      return handleError(task);
    }
    return TaskDto.create(task);
  }
  @Patch(":id")
  @UseGuards(TokenGuard)
  @UseZodGuard("body", CreateTaskDto)
  @UseZodGuard("params", TaskIdParam)
  async updateTask(@Body() data: CreateTaskDto, @Param("id") id: string) {
    const task = await this.taskService.updateOne(data, id);
    if (isError(task)) {
      return handleError(task);
    }
    return TaskDto.create(task);
  }

  @Post(":id/status")
  @UseGuards(TokenGuard)
  @UseZodGuard("params", TaskIdParam)
  @UseZodGuard("body", UpdateStatusDto)
  async updateStatus(@Body() data: UpdateStatusDto, @Param("id") id: string) {
    const task = await this.taskService.updateOne(data, id);
    if (isError(task)) {
      return handleError(task);
    }
    return TaskDto.create(task);
  }

  @Patch(":id/date")
  @UseGuards(TokenGuard)
  @UseZodGuard("params", TaskIdParam)
  @UseZodGuard("body", UpdateDateDto)
  async updateDate(@Body() data: UpdateDateDto, @Param("id") id: string) {
    const task = await this.taskService.updateOne(data, id);
    if (isError(task)) {
      return handleError(task);
    }
    return TaskDto.create(task);
  }

  @Delete('all')
  @UseGuards(TokenGuard)
  async deleteTrashedTasks(@Req() req){
    const user = req.session["user"] as UserDto;
    const response = await this.taskService.deleteTrashedTasks(user.id)
    if(isError(response)){
      return handleError(response)
    }
    return response
  }

  @Delete(":id")
  @UseGuards(TokenGuard)
  @UseZodGuard("params", TaskIdParam)
  async deleteTask(@Param("id") id: string) {
    const task = await this.taskService.deleteOne(id);
    if (isError(task)) {
      return handleError(task);
    }
    return TaskDto.create(task);
  }
  @Post("batch")
  @UseGuards(TokenGuard)
  @UsePipes(CreateTasksDto)
  async createMany(@Body() data: CreateTasksDto, @Req() req: Request) {
    const user = req.session["user"] as UserDto;
    const tasks = await this.taskService.createMany({
      user_id: user.id,
      data: data.tasks
    });
    if (isError(tasks)) {
      return handleError(tasks);
    }
    return TasksDto.create(tasks);
  }

  @Patch(":id/trash")
  @UseGuards(TokenGuard)
  @UseZodGuard("params", TaskIdParam)
  async trash(@Param("id") id: string) {
    const task = await this.taskService.updateOne({ is_deleted: true }, id);
    if (isError(task)) {
      return handleError(task);
    }
    return TaskDto.create(task);
  }
}
