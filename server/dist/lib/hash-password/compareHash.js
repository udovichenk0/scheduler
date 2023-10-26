"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = void 0;
const bcrypt = require("bcrypt");
const compareHash = async (comparedHash, password) => {
    const hash = await bcrypt.compare(password, comparedHash);
    return hash;
};
exports.compareHash = compareHash;
//# sourceMappingURL=compareHash.js.map