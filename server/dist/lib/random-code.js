"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCode = void 0;
const crypto_1 = require("crypto");
function randomCode() {
    return (0, crypto_1.randomInt)(1000000).toString().padStart(6, '0');
}
exports.randomCode = randomCode;
//# sourceMappingURL=random-code.js.map