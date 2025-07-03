import crypto from 'crypto';
import { Resend } from 'resend';

import { Types } from 'mongoose';

import { hashPassword } from '../utils/passwordUtils'

import PasswordReset from '../models/passwordResetModel';
import User from '../models/userModel';

import { passwordResetEmailTemplate, renderEmailTemplate } from '../emails/emailTemplates'

const PASSWORD_RESET_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

const resend = new Resend(process.env.RESEND_API_KEY);

export const passwordResetService = {
    sendResetEmail: async (id: Types.ObjectId, email: string) => {
        // todo safely convert email to userid
        const newPasswordResetToken = crypto.randomBytes(32).toString('hex');
        const newPasswordReset = new PasswordReset({
            user: id,
            token: newPasswordResetToken,
            expiresAt:  new Date(Date.now() + PASSWORD_RESET_EXPIRY)
        });
        await newPasswordReset.save();

        const { data, error } = await resend.emails.send({
            from: 'Sidequests <accounts@email.sidequests.nz>',
            to: [email],
            subject: 'Password reset instructions',
            html: renderEmailTemplate(passwordResetEmailTemplate, { "RESET_URL": `https://sidequests.nz/reset-password?token=${newPasswordResetToken}`}),
        });
    },
    resetPasswordWithToken: async (token: string, newPassword:string): Promise<boolean> => {
        const foundPasswordReset = await PasswordReset.findOne({ token: token })
        if (!foundPasswordReset) return false;
        if (foundPasswordReset.expiresAt < new Date()) return false; // TTL index should delete the document once it is expired, but there is a delay hence this check
        const user = await User.findByIdAndUpdate(
            foundPasswordReset.user,
            { 
                lastPasswordReset: new Date(), 
                passwordHash: hashPassword(newPassword)
            }
        );
        await foundPasswordReset.deleteOne({ _id: foundPasswordReset._id })
        if (!user) return false;
        return true;
    }
}