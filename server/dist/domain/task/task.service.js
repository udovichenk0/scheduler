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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const uuid_1 = require("uuid");
let TaskService = class TaskService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findMany({ id }) {
        const tasks = this.prismaService.task.findMany({
            where: {
                user_id: id,
            },
        });
        return tasks;
    }
    createOne(data) {
        const task = this.prismaService.task.create({
            data: Object.assign(Object.assign({}, data), { id: (0, uuid_1.v4)() }),
        });
        return task;
    }
    updateOne({ data, where }) {
        const task = this.prismaService.task.update({
            data,
            where,
        });
        return task;
    }
    updateStatus({ data, where }) {
        const task = this.prismaService.task.update({
            data,
            where,
        });
        return task;
    }
    deleteOne({ where }) {
        const task = this.prismaService.task.delete({
            where,
        });
        return task;
    }
    createMany({ user_id, data, }) {
        const tasks = this.prismaService.task.createMany({
            data: data.map((task) => (Object.assign(Object.assign({}, task), { id: (0, uuid_1.v4)(), user_id }))),
        });
        return tasks;
    }
};
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map