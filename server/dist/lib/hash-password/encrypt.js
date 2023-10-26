"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = void 0;
const bcrypt = require("bcrypt");
const encryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};
exports.encryptPassword = encryptPassword;
//# sourceMappingURL=encrypt.js.map