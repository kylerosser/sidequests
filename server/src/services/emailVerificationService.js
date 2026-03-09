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
exports.emailVerificationService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const resend_1 = require("resend");
const emailVerificationModel_1 = __importDefault(require("../models/emailVerificationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const emailTemplates_1 = require("../emails/emailTemplates");
const EMAIL_VERIFICATION_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
exports.emailVerificationService = {
    sendVerificationEmail: (id, email) => __awaiter(void 0, void 0, void 0, function* () {
        let hasBeenResent = false;
        const existingEmailVerification = yield emailVerificationModel_1.default.findOne({ user: id });
        if (existingEmailVerification)
            hasBeenResent = true;
        const newEmailVerificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const newEmailVerification = new emailVerificationModel_1.default({
            user: id,
            token: newEmailVerificationToken,
            expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY),
            hasBeenResent
        });
        yield newEmailVerification.save();
        const { data, error } = yield resend.emails.send({
            from: 'Sidequests <accounts@email.sidequests.nz>',
            to: [email],
            subject: 'Please verify your email address',
            html: (0, emailTemplates_1.renderEmailTemplate)(emailTemplates_1.verificationEmailTemplate, { "VERIFY_URL": `https://sidequests.nz/verify?token=${newEmailVerificationToken}` }),
        });
    }),
    sendVerificationEmailIfExpired: (id, email) => __awaiter(void 0, void 0, void 0, function* () {
        let expired = true;
        const existingEmailVerifications = yield emailVerificationModel_1.default.find({ user: id });
        existingEmailVerifications.forEach((existingEmailVerification) => {
            if (existingEmailVerification.expiresAt > new Date())
                expired = false;
        });
        if (!expired)
            return;
        yield exports.emailVerificationService.sendVerificationEmail(id, email);
    }),
    verifyUserWithToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const foundEmailVerification = yield emailVerificationModel_1.default.findOne({ token: token });
        if (!foundEmailVerification)
            return false;
        if (foundEmailVerification.expiresAt < new Date())
            return false; // TTL index should delete the document once it is expired, but there is a delay hence this check
        const user = yield userModel_1.default.findByIdAndUpdate(foundEmailVerification.user, { isEmailVerified: true });
        yield emailVerificationModel_1.default.deleteOne({ _id: foundEmailVerification._id });
        if (!user)
            return false;
        return true;
    })
};
