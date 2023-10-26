"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = exports.UserCredentials = exports.userDtoSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const userCredentialsSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(4),
});
exports.userDtoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email().min(4),
    verified: zod_1.z.boolean(),
});
class UserCredentials extends (0, nestjs_zod_1.createZodDto)(userCredentialsSchema) {
}
exports.UserCredentials = UserCredentials;
class UserDto extends (0, nestjs_zod_1.createZodDto)(exports.userDtoSchema) {
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map