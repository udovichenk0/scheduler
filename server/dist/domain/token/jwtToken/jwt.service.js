"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwtError_1 = require("./constant/jwtError");
const jwtErrorMessages_1 = require("./constant/jwtErrorMessages");
let JWTService = class JWTService {
    async signToken(userData) {
        const token = await (0, jsonwebtoken_1.sign)(userData, process.env.JWT_SECRET, {
            expiresIn: '30m',
        });
        return token;
    }
    async verifyToken(token) {
        try {
            return await (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.message) == jwtError_1.jwtExpiredError) {
                throw new common_1.UnauthorizedException(jwtErrorMessages_1.jwtExpiredMessage);
            }
            if (err.message == jwtError_1.jwtInvalidError) {
                throw new common_1.UnauthorizedException(jwtErrorMessages_1.jwtInvalidMessage);
            }
        }
    }
};
JWTService = __decorate([
    (0, common_1.Injectable)()
], JWTService);
exports.JWTService = JWTService;
//# sourceMappingURL=jwt.service.js.map