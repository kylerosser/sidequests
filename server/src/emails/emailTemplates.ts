import { readFileSync } from 'fs';
import path from 'path';

export const verificationEmailTemplate = readFileSync(path.join(__dirname, '../emails/verificationEmailTemplate.html'), 'utf-8')
export const passwordResetEmailTemplate = readFileSync(path.join(__dirname, '../emails/passwordResetEmailTemplate.html'), 'utf-8')

export const renderEmailTemplate = (template: string, values: Record<string, string>) => {
    // Replaces any template values e.g. {{VERIFY_URL}} with a concrete value provided
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => values[key] || '');
}