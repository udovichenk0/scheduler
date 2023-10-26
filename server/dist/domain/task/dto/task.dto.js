"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTaskCredentialsDto = exports.DeleteTaskCredentialSchema = exports.TaskDto = exports.CreateManyTasksCredentialDto = exports.UpdateStatusCredentialDto = exports.updateStatusCredentialsDto = exports.UpdateDateCredentialsDto = exports.UpdateTaskCredentialDto = exports.CreateTaskCredentialDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const TaskContract = zod_1.z.object({
    title: zod_1.z.string().nonempty(),
    description: zod_1.z.string(),
    status: zod_1.z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
    type: zod_1.z.enum(['inbox', 'unplaced']),
    start_date: zod_1.z.string().pipe(zod_1.z.coerce.date()).nullable(),
});
class CreateTaskCredentialDto extends (0, nestjs_zod_1.createZodDto)(TaskContract) {
}
exports.CreateTaskCredentialDto = CreateTaskCredentialDto;
const UpdateTaskContract = zod_1.z.object({
    id: zod_1.z.string(),
    task: TaskContract,
});
class UpdateTaskCredentialDto extends (0, nestjs_zod_1.createZodDto)(UpdateTaskContract) {
}
exports.UpdateTaskCredentialDto = UpdateTaskCredentialDto;
const UpdateDateContract = zod_1.z.object({
    id: zod_1.z.string(),
    date: zod_1.z.string().pipe(zod_1.z.coerce.date()).nullable(),
});
class UpdateDateCredentialsDto extends (0, nestjs_zod_1.createZodDto)(UpdateDateContract) {
}
exports.UpdateDateCredentialsDto = UpdateDateCredentialsDto;
exports.updateStatusCredentialsDto = zod_1.z.object({
    id: zod_1.z.string(),
    status: zod_1.z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
});
class UpdateStatusCredentialDto extends (0, nestjs_zod_1.createZodDto)(exports.updateStatusCredentialsDto) {
}
exports.UpdateStatusCredentialDto = UpdateStatusCredentialDto;
const CreateManyTasksCredentials = zod_1.z.object({ tasks: TaskContract.array() });
class CreateManyTasksCredentialDto extends (0, nestjs_zod_1.createZodDto)(CreateManyTasksCredentials) {
}
exports.CreateManyTasksCredentialDto = CreateManyTasksCredentialDto;
const TaskDtoContract = TaskContract.extend({
    title: zod_1.z.string().nonempty(),
    description: zod_1.z.string(),
    status: zod_1.z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
    type: zod_1.z.enum(['inbox', 'unplaced']),
    start_date: zod_1.z.date().nullable(),
    id: zod_1.z.string(),
    user_id: zod_1.z.string(),
});
class TaskDto extends (0, nestjs_zod_1.createZodDto)(TaskDtoContract) {
}
exports.TaskDto = TaskDto;
exports.DeleteTaskCredentialSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
class DeleteTaskCredentialsDto extends (0, nestjs_zod_1.createZodDto)(exports.DeleteTaskCredentialSchema) {
}
exports.DeleteTaskCredentialsDto = DeleteTaskCredentialsDto;
//# sourceMappingURL=task.dto.js.map