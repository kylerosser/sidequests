"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswordToHash = exports.hashPassword = exports.validatePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const SALT_ROUNDS = 10;
const validatePassword = (password) => {
    // Ensure password is of an acceptable length
    if (password.length < MIN_PASSWORD_LENGTH) {
        return { success: false, data: `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long` };
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
        return { success: false, data: `Your password is too long. ${MAX_PASSWORD_LENGTH} character limit.` };
    }
    // Password must contain at least one letter and one number
    const passwordComplexityRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d).+$`);
    if (!passwordComplexityRegex.test(password)) {
        return { success: false, data: "Your password must contain at least one letter and one number" };
    }
    return { success: true, data: "Password is acceptable" };
};
exports.validatePassword = validatePassword;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, SALT_ROUNDS);
});
exports.hashPassword = hashPassword;
const comparePasswordToHash = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hash);
});
exports.comparePasswordToHash = comparePasswordToHash;
