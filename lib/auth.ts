


const textEncoder = new TextEncoder();

/**
 * Hashes a password using the SHA-256 algorithm.
 * @param password The password string to hash.
 * @returns A promise that resolves to the hex string of the hash.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const data = textEncoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const USERS_STORAGE_KEY = 'law-ai-users';
export const TOKEN_STORAGE_KEY = 'law-ai-token';
export const USER_EMAIL_KEY = 'law-ai-user-email';
export const USER_ROLE_KEY = 'law-ai-user-role';
export const PASSWORD_RESET_TOKEN_STORAGE_KEY = 'law-ai-reset-tokens';
