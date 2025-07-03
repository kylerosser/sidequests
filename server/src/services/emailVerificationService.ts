import crypto from 'crypto';
import { Resend } from 'resend';

import { Types } from 'mongoose';

import EmailVerification from '../models/emailVerificationModel';
import User from '../models/userModel';

import { verificationEmailTemplate, renderEmailTemplate } from '../emails/emailTemplates'

const EMAIL_VERIFICATION_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailVerificationService = {
    sendVerificationEmail: async (id: Types.ObjectId, email: string) => {
        let hasBeenResent = false;
        const existingEmailVerification = await EmailVerification.findOne({ user: id })
        if (existingEmailVerification) hasBeenResent = true;

        const newEmailVerificationToken = crypto.randomBytes(32).toString('hex');
        const newEmailVerification = new EmailVerification({
            user: id,
            token: newEmailVerificationToken,
            expiresAt:  new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY),
            hasBeenResent
        });
        await newEmailVerification.save();

        const { data, error } = await resend.emails.send({
            from: 'Sidequests <accounts@email.sidequests.nz>',
            to: [email],
            subject: 'Please verify your email address',
            html: renderEmailTemplate(verificationEmailTemplate, { "VERIFY_URL": `https://sidequests.nz/verify?token=${newEmailVerificationToken}`}),
        });
    },
    sendVerificationEmailIfExpired: async (id: Types.ObjectId, email: string) => {
        let expired = true;
        const existingEmailVerifications = await EmailVerification.find({ user: id })
        existingEmailVerifications.forEach((existingEmailVerification) => {
            if (existingEmailVerification.expiresAt > new Date()) expired = false;
        })
        if (!expired) return;
        await emailVerificationService.sendVerificationEmail(id, email);
    },
    verifyUserWithToken: async (token: string): Promise<boolean> => {
        const foundEmailVerification = await EmailVerification.findOne({ token: token })
        if (!foundEmailVerification) return false;
        if (foundEmailVerification.expiresAt < new Date()) return false; // TTL index should delete the document once it is expired, but there is a delay hence this check
        const user = await User.findByIdAndUpdate(foundEmailVerification.user, { isEmailVerified: true });
        await EmailVerification.deleteOne({ _id: foundEmailVerification._id })
        if (!user) return false;
        return true;
    }
}