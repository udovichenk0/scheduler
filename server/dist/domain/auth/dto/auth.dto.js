"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDto = exports.AuthCredentialsDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const user_dto_1 = require("../../user/dto/user.dto");
const zod_1 = require("zod");
const authCredentialSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(4),
    password: zod_1.z.string().min(8),
});
const authDtoSchema = zod_1.z.object({
    user: user_dto_1.userDtoSchema,
    access_token: zod_1.z.string(),
});
class AuthCredentialsDto extends (0, nestjs_zod_1.createZodDto)(authCredentialSchema) {
}
exports.AuthCredentialsDto = AuthCredentialsDto;
class AuthDto extends (0, nestjs_zod_1.createZodDto)(authDtoSchema) {
}
exports.AuthDto = AuthDto;
//# sourceMappingURL=auth.dto.js.map