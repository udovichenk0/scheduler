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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const refresh_service_1 = require("./refreshToken/refresh.service");
const user_dto_1 = require("../user/dto/user.dto");
const jwt_service_1 = require("./jwtToken/jwt.service");
const tokenErrorMessages_1 = require("./constant/tokenErrorMessages");
const user_service_1 = require("../user/user.service");
let TokenService = class TokenService {
    constructor(prismaService, refreshService, userService, jwtService) {
        this.prismaService = prismaService;
        this.refreshService = refreshService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async issueTokens(userData) {
        const access_token = await this.jwtService.signToken(userData);
        const refresh_token = await this.refreshService.signRefresh(userData);
        return {
            access_token,
            refresh_token,
        };
    }
    async refresh(refreshToken, session) {
        if (!refreshToken) {
            return null;
        }
        const userData = await this.refreshService.verifyRefresh(refreshToken);
        if (!userData) {
            session['refresh_token'] = null;
            throw new common_1.UnauthorizedException(tokenErrorMessages_1.userNotAuthorized);
        }
        const user = await this.userService.findOne({ id: userData.id });
        const { access_token } = await this.issueTokens(user_dto_1.UserDto.create(user));
        return {
            access_token,
            userData,
        };
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        refresh_service_1.RefreshService,
        user_service_1.UserService,
        jwt_service_1.JWTService])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map