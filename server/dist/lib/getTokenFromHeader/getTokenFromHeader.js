"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromHeader = void 0;
function getTokenFromHeader(req) {
    var _a;
    const header = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ');
    if (header && header[0] === 'Bearer' && header[1]) {
        return header[1];
    }
}
exports.getTokenFromHeader = getTokenFromHeader;
//# sourceMappingURL=getTokenFromHeader.js.map