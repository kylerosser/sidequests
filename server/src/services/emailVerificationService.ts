import crypto from 'crypto';

import { Types } from 'mongoose';

import EmailVerification from '../models/emailVerificationModel';

const EMAIL_VERIFICATION_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

export const emailVerificationService = {
    createNewEmailVerification: async (id: Types.ObjectId) => {
        const newEmailVerificationToken = crypto.randomBytes(32).toString('hex');
        const newEmailVerification = new EmailVerification({
            user: id,
            token: newEmailVerificationToken,
            expiresAt:  new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY)
        });
        await newEmailVerification.save();
        return newEmailVerification;
    },
    sendVerificationEmail: async (email: string, token: string) => {
        // try catch to fail gracefully without error
        console.log(`Sending email to ${email} with token: ${token}`);
    }
}