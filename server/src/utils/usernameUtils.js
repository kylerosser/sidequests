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
exports.generateUsernameFromEmail = exports.validateUsername = void 0;
const crypto_1 = __importDefault(require("crypto"));
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const userModel_1 = __importDefault(require("../models/userModel"));
const validateUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure username is of an acceptable length
    if (username.length < MIN_USERNAME_LENGTH) {
        return { success: false, data: `Your username must be at least ${MIN_USERNAME_LENGTH} characters` };
    }
    if (username.length > MAX_USERNAME_LENGTH) {
        return { success: false, data: `Your username cannot be greater than ${MAX_USERNAME_LENGTH} characters` };
    }
    // Ensure username is unique (case insensitive)
    const existingUsername = yield userModel_1.default.findOne({
        username: { $regex: `^${username}$`, $options: 'i' } // ignore case
    });
    if (existingUsername) {
        return { success: false, data: "This username is already in use" };
    }
    return { success: true, data: "Username is acceptable" };
});
exports.validateUsername = validateUsername;
const generateUsernameFromEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // First, try and generate a valid username using the user's email
    const localPart = email.split('@')[0];
    const cleaned = localPart.replace(/[^a-zA-Z0-9]/g, '');
    const username = cleaned.toLowerCase();
    const truncatedUsername = username.slice(0, MAX_USERNAME_LENGTH);
    const validateUsernameResult = yield (0, exports.validateUsername)(truncatedUsername);
    // If our username is valid, return it
    if (validateUsernameResult.success)
        return truncatedUsername;
    // Otherwise, fallback to a random string of characters
    let retries = 0;
    while (retries != 5) {
        const randomUsername = crypto_1.default.randomBytes(4).toString('hex');
        const validateUsernameResult = yield (0, exports.validateUsername)(randomUsername);
        if (validateUsernameResult.success)
            return randomUsername;
    }
    // If we failed to generate a valid random username, return null
    return null;
});
exports.generateUsernameFromEmail = generateUsernameFromEmail;
