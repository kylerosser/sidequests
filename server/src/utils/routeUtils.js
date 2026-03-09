"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumber = void 0;
const parseNumber = (value) => {
    const num = parseFloat(value);
    if (isNaN(num))
        throw new Error("Invalid number");
    return num;
};
exports.parseNumber = parseNumber;
