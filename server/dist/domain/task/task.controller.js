"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const token_guard_1 = require("../token/guards/token-guard");
const task_service_1 = require("./task.service");
const task_dto_1 = require("./dto/task.dto");
const nestjs_zod_1 = require("nestjs-zod");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    async getTasks(req) {
        const user = req.session['user'];
        const tasks = await this.taskService.findMany({ id: user.id });
        return tasks;
    }
    async createTask(req, taskCredentials) {
        const user = req.session['user'];
        const task = await this.taskService.createOne(Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, taskCredentials), { user: {
                connect: {
                    id: user.id,
                },
            } }));
        return task_dto_1.TaskDto.create(task);
    }
    async updateTask(taskCredentials) {
        const { id, task } = taskCredentials;
        const updatedTask = await this.taskService.updateOne({
            data: task,
            where: {
                id,
            },
        });
        return task_dto_1.TaskDto.create(updatedTask);
    }
    async updateStatus(taskCredentials) {
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
    async updateDate(taskCredentials) {
        const task = await this.taskService.updateOne({
            data: {
                start_date: taskCredentials.date,
            },
            where: {
                id: taskCredentials.id,
            },
        });
        return task;
    }
    async deleteTask(taskCredentials) {
        const { id } = taskCredentials;
        const task = await this.taskService.deleteOne({
            where: {
                id,
            },
        });
        return task;
    }
    async createMany(data, req) {
        const user = req.session['user'];
        const tasks = data.tasks;
        const response = await this.taskService.createMany({
            user_id: user.id,
            data: tasks,
        });
        return response;
    }
};
__decorate([
    (0, common_1.Get)('get'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UsePipes)(new nestjs_zod_1.ZodValidationPipe(task_dto_1.CreateTaskCredentialDto)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, task_dto_1.CreateTaskCredentialDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Post)('update'),
    (0, common_1.UsePipes)(new nestjs_zod_1.ZodValidationPipe(task_dto_1.UpdateTaskCredentialDto)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.UpdateTaskCredentialDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Post)('update-status'),
    (0, common_1.UsePipes)(new nestjs_zod_1.ZodValidationPipe(task_dto_1.UpdateStatusCredentialDto)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.UpdateStatusCredentialDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)('update-date'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.UpdateDateCredentialsDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateDate", null);
__decorate([
    (0, common_1.Post)('delete'),
    (0, common_1.UsePipes)(new nestjs_zod_1.ZodValidationPipe(task_dto_1.DeleteTaskCredentialsDto)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.DeleteTaskCredentialsDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Post)('create-many'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.CreateManyTasksCredentialDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createMany", null);
TaskController = __decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(token_guard_1.TokenGuard),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map