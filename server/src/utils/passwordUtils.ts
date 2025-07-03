import bcrypt from 'bcrypt';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const SALT_ROUNDS = 10;

export const validatePassword = (password: string) => {
    // Ensure password is of an acceptable length
    if (password.length < MIN_PASSWORD_LENGTH) {
        return {success: false, data: `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long`};
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
        return {success: false, data: `Your password is too long. ${MAX_PASSWORD_LENGTH} character limit.`};
    }

    // Password must contain at least one letter and one number
    const passwordComplexityRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d).+$`);
    if (!passwordComplexityRegex.test(password)) {
        return {success: false, data: "Your password must contain at least one letter and one number"};
    }

    return {success: true, data: "Password is acceptable"}
}

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePasswordToHash = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}