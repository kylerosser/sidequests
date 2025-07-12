import crypto from 'crypto';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

import User from '../models/userModel';

export const validateUsername = async (username: string) => {
    // Ensure username is of an acceptable length
    if (username.length < MIN_USERNAME_LENGTH) {
        return {success: false, data: `Your username must be at least ${MIN_USERNAME_LENGTH} characters`};
    }
    if (username.length > MAX_USERNAME_LENGTH) {
        return {success: false, data: `Your username cannot be greater than ${MAX_USERNAME_LENGTH} characters`};
    }
    
    // Ensure username is unique (case insensitive)
    const existingUsername = await User.findOne({
        username: { $regex: `^${username}$`, $options: 'i' } // ignore case
    }); 
    if (existingUsername) {
        return {success: false, data: "This username is already in use"};
    }
    return {success: true, data: "Username is acceptable"}
}

export const generateUsernameFromEmail = async (email: string): Promise<string | null> => {
    // First, try and generate a valid username using the user's email
    const localPart = email.split('@')[0];
    const cleaned = localPart.replace(/[^a-zA-Z0-9]/g, '');
    const username = cleaned.toLowerCase();
    const truncatedUsername = username.slice(0, MAX_USERNAME_LENGTH);
    const validateUsernameResult = await validateUsername(truncatedUsername)
    // If our username is valid, return it
    if (validateUsernameResult.success) return truncatedUsername;

    // Otherwise, fallback to a random string of characters
    let retries = 0;
    while (retries != 5) {
        const randomUsername = crypto.randomBytes(4).toString('hex');
        const validateUsernameResult = await validateUsername(randomUsername)
        if (validateUsernameResult.success) return randomUsername;
    }

    // If we failed to generate a valid random username, return null
    return null;
}