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
exports.passwordResetService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const resend_1 = require("resend");
const passwordUtils_1 = require("../utils/passwordUtils");
const passwordResetModel_1 = __importDefault(require("../models/passwordResetModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const emailTemplates_1 = require("../emails/emailTemplates");
const PASSWORD_RESET_EXPIRY = 1000 * 60 * 60 * 1; // 1 hour
const PASSWORD_RESET_COOLDOWN = 1000 * 60 * 60 * 6; // 6 hours
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
exports.passwordResetService = {
    sendResetEmail: (id, email) => __awaiter(void 0, void 0, void 0, function* () {
        // todo safely convert email to userid
        const newPasswordResetToken = crypto_1.default.randomBytes(32).toString('hex');
        const newPasswordReset = new passwordResetModel_1.default({
            user: id,
            token: newPasswordResetToken,
            expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRY)
        });
        const result = yield newPasswordReset.save();
        const { data, error } = yield resend.emails.send({
            from: 'Sidequests <accounts@email.sidequests.nz>',
            to: [email],
            subject: 'Password reset instructions',
            html: (0, emailTemplates_1.renderEmailTemplate)(emailTemplates_1.passwordResetEmailTemplate, { "RESET_URL": `https://sidequests.nz/reset-password?token=${newPasswordResetToken}` }),
        });
    }),
    checkUserEligibleForReset: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const existingPasswordReset = yield passwordResetModel_1.default.findOne({ user: id });
        if (existingPasswordReset)
            return false;
        const user = yield userModel_1.default.findById(id);
        if (!user)
            return false;
        if (Date.now() - user.lastPasswordReset.getTime() <= PASSWORD_RESET_COOLDOWN)
            return false;
        return true;
    }),
    resetPasswordWithToken: (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const foundPasswordReset = yield passwordResetModel_1.default.findOne({ token: token });
        if (!foundPasswordReset)
            return false;
        if (foundPasswordReset.expiresAt < new Date())
            return false; // TTL index should delete the document once it is expired, but there is a delay hence this check
        const newPasswordHash = yield (0, passwordUtils_1.hashPassword)(newPassword);
        const user = yield userModel_1.default.findByIdAndUpdate(foundPasswordReset.user, {
            lastPasswordReset: new Date(),
            passwordHash: newPasswordHash
        });
        yield foundPasswordReset.deleteOne({ _id: foundPasswordReset._id });
        if (!user)
            return false;
        return true;
    })
};
