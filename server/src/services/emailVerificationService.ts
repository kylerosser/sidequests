import crypto from 'crypto';

import { Types } from 'mongoose';

import EmailVerification from '../models/emailVerificationModel';
import User from '../models/userModel';

const EMAIL_VERIFICATION_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

export const emailVerificationService = {
    createNewEmailVerification: async (id: Types.ObjectId) => {
        let hasBeenResent = false;
        const existingEmailVerification = await EmailVerification.findOne()
        if (existingEmailVerification) hasBeenResent = true;

        const newEmailVerificationToken = crypto.randomBytes(32).toString('hex');
        const newEmailVerification = new EmailVerification({
            user: id,
            token: newEmailVerificationToken,
            expiresAt:  new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY),
            hasBeenResent
        });
        await newEmailVerification.save();
        return newEmailVerification;
    },
    sendVerificationEmail: async (email: string, token: string) => {
        // try catch to fail gracefully without error
        console.log(`Sending email to ${email} with token: ${token}`);
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