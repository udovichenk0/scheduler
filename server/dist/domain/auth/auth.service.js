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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const encrypt_1 = require("../../lib/hash-password/encrypt");
const token_service_1 = require("../token/token.service");
const user_dto_1 = require("../user/dto/user.dto");
const authErrorMessages_1 = require("./constant/authErrorMessages");
const compareHash_1 = require("../../lib/hash-password/compareHash");
const uuid_1 = require("uuid");
const send_email_1 = require("../../nodemailer/send-email");
const random_code_1 = require("../../lib/random-code");
let AuthService = class AuthService {
    constructor(prismaService, tokenService) {
        this.prismaService = prismaService;
        this.tokenService = tokenService;
    }
    async createUser(credentials) {
        const potentialUser = await this.prismaService.user.findUnique({
            where: {
                email: credentials.email,
            },
        });
        if (potentialUser) {
            throw new common_1.ConflictException('User already exist');
        }
        const hash = await (0, encrypt_1.encryptPassword)(credentials.password);
        const code = (0, random_code_1.randomCode)();
        const user = await this.prismaService.user.create({
            data: {
                email: credentials.email,
                hash,
                id: (0, uuid_1.v4)(),
            },
        });
        await this.prismaService.emailConfirmation.create({
            data: {
                id: (0, uuid_1.v4)(),
                code,
                user_id: user.id,
            },
        });
        await (0, send_email_1.sendEmail)(credentials.email, code);
        return user;
    }
    async verifyUser(credentials) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: credentials.email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException((0, authErrorMessages_1.userNotFound)(credentials.email));
        }
        const compared = await (0, compareHash_1.compareHash)(user.hash, credentials.password);
        if (!compared) {
            throw new common_1.NotFoundException(authErrorMessages_1.passwordNotCorrect);
        }
        const { access_token, refresh_token } = await this.tokenService.issueTokens(user_dto_1.UserDto.create(user));
        return {
            user,
            access_token,
            refresh_token,
        };
    }
    async verifyEmail({ code, email }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException((0, authErrorMessages_1.userNotFound)(email));
        }
        const confirmation = await this.prismaService.emailConfirmation.findUnique({
            where: {
                user_id: user.id,
            },
        });
        if (!confirmation) {
            throw new common_1.NotFoundException((0, authErrorMessages_1.userNotFound)(email));
        }
        const isValid = confirmation.code === code;
        if (!isValid) {
            throw new common_1.NotAcceptableException('Code is not valid');
        }
        const verifiedUser = await this.prismaService.user.update({
            where: {
                id: user.id,
            },
            data: {
                verified: true,
            },
        });
        await this.prismaService.emailConfirmation.delete({
            where: {
                user_id: verifiedUser.id,
            },
        });
        const { access_token, refresh_token } = await this.tokenService.issueTokens(user_dto_1.UserDto.create(user));
        return {
            user: verifiedUser,
            access_token,
            refresh_token,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        token_service_1.TokenService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map