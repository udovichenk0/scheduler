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
exports.TokenGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../jwtToken/jwt.service");
const getTokenFromHeader_1 = require("../../../lib/getTokenFromHeader/getTokenFromHeader");
const tokenErrorMessages_1 = require("../constant/tokenErrorMessages");
const user_dto_1 = require("../../user/dto/user.dto");
let TokenGuard = class TokenGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = (0, getTokenFromHeader_1.getTokenFromHeader)(req);
        if (!token) {
            throw new common_1.UnauthorizedException(tokenErrorMessages_1.tokenNotFound);
        }
        const userDto = await this.jwtService.verifyToken(token);
        if (!userDto) {
            throw new common_1.UnauthorizedException(tokenErrorMessages_1.userNotAuthorized);
        }
        req.session['user'] = user_dto_1.UserDto.create(userDto);
        return userDto;
    }
};
TokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JWTService])
], TokenGuard);
exports.TokenGuard = TokenGuard;
//# sourceMappingURL=token-guard.js.map