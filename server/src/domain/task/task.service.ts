import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { TaskRepository } from "./repository/task.repository";
import { Errors } from "src/services/err/errors";
import { getTodayDate } from "./lib";
@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}
  async findManyByUserId(userId: string) {
    try {
      return await this.taskRepository.findManyByUserId(userId);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findInboxTasks(userId: string) {
    try {
      return await this.taskRepository.findMany({
        user_id: userId,
        type: "inbox",
        is_deleted: false
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findTodayTasks(userId: string) {
    try {
      return await this.taskRepository.findMany({
        user_id: userId,
        type: "unplaced",
        is_deleted: false,
        start_date: {
          equals: getTodayDate()
        }
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findTrashTasks(userId: string) {
    try {
      return await this.taskRepository.findMany({
        user_id: userId,
        is_deleted: true
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findOverdueTasks(userId: string) {
    try {
      return await this.taskRepository.findMany({
        user_id: userId,
        type: "unplaced",
        is_deleted: false,
        start_date: {
          lt: getTodayDate()
        }
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findUnplacedTasks(userId: string) {
    try {
      return await this.taskRepository.findMany({
        user_id: userId,
        type: "unplaced",
        is_deleted: false
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findInboxTaskCount(userId: string) {
    try {
      return await this.taskRepository.findTaskCount({
        user_id: userId,
        is_deleted: false,
        type: "inbox"
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findTodayTaskCount(userId: string) {
    try {
      return await this.taskRepository.findTaskCount({
        user_id: userId,
        type: "unplaced",
        is_deleted: false,
        start_date: {
          equals: getTodayDate()
        }
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async findUpcomingTasks(userId: string) {
    try {
      const tasks = await this.taskRepository.findMany({
        user_id: userId,
        type: "unplaced",
        is_deleted: false,
        start_date: {
          gte: getTodayDate()
        }
      });
      return tasks;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  createOne(data: Prisma.taskCreateInput) {
    try {
      return this.taskRepository.create(data);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  updateOne(data: Prisma.taskUpdateInput, id: string) {
    try {
      return this.taskRepository.updateById(data, id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  deleteOne(id: string) {
    try {
      return this.taskRepository.deleteById(id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async createMany({
    user_id,
    data
  }: {
    user_id: string;
    data: Omit<Prisma.taskCreateManyInput, "user_id" | "id">[];
  }) {
    try {
      return await this.taskRepository.createManyByUserId({
        user_id,
        data
      });
      return;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  deleteTrashedTasks(userId: string) {
    try {
      if (!userId) {
        return Errors.Missing("User id");
      }
      return this.taskRepository.deleteMany({
        user_id: userId,
        AND: {
          is_deleted: true
        }
      });
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
}
