// This is a backend-only utility file.

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
