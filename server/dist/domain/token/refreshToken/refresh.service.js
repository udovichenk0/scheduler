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
exports.RefreshService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_service_1 = require("../../../database/prisma.service");
const refreshErrorMessages_1 = require("./constant/refreshErrorMessages");
const refreshErrors_1 = require("./constant/refreshErrors");
let RefreshService = class RefreshService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async signRefresh(userData) {
        const token = await (0, jsonwebtoken_1.sign)(userData, process.env.JWT_SECRET, {
            expiresIn: '15d',
        });
        return token;
    }
    async verifyRefresh(token) {
        try {
            return (await (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET));
        }
        catch (err) {
            if (err.message == refreshErrors_1.refreshExpiredError) {
                throw new common_1.UnauthorizedException(refreshErrorMessages_1.refreshExpiredMessage);
            }
            if (err.message == refreshErrors_1.refreshInvalidError) {
                throw new common_1.UnauthorizedException(refreshErrorMessages_1.refreshInvalidMessage);
            }
        }
    }
};
RefreshService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefreshService);
exports.RefreshService = RefreshService;
//# sourceMappingURL=refresh.service.js.map