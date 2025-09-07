import type { UserRole, LetterRequest } from '../types';
import { MOCK_LETTERS } from '../constants';
import { hashPassword } from './utils';

// This file simulates a persistent database using localStorage.
// In a real application, this would be replaced with calls to a real database (e.g., PostgreSQL, MongoDB).

// --- USER DATA ---

const USERS_STORAGE_KEY = 'law-ai-users';

export interface StoredUser {
  hash: string;
  role: UserRole;
}

export const getUsers = (): Record<string, StoredUser> => {
    try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
};

export const saveUsers = (users: Record<string, StoredUser>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// --- LETTER DATA ---

const LETTERS_STORAGE_KEY = 'law-ai-user-letters';

export const getLetters = (): LetterRequest[] => {
     try {
        const stored = localStorage.getItem(LETTERS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // If nothing is in storage, initialize with mock data.
        saveLetters(MOCK_LETTERS);
        return MOCK_LETTERS;
    } catch (error) {
        console.error("Error reading letters from storage", error);
        return MOCK_LETTERS; // Fallback to mock data.
    }
};

export const saveLetters = (letters: LetterRequest[]) => {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(letters));
};

// --- PASSWORD RESET TOKENS ---
const PASSWORD_RESET_TOKEN_STORAGE_KEY = 'law-ai-reset-tokens';

interface ResetTokenData {
    email: string;
    expiry: number;
}
export const getResetTokens = (): Record<string, ResetTokenData> => {
    try {
        const stored = localStorage.getItem(PASSWORD_RESET_TOKEN_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
};
export const saveResetTokens = (tokens: Record<string, ResetTokenData>) => {
    localStorage.setItem(PASSWORD_RESET_TOKEN_STORAGE_KEY, JSON.stringify(tokens));
};


// --- INITIALIZATION ---
// One-time setup for demo accounts if they don't exist.
export const initializeDemoData = async () => {
    const setupDone = localStorage.getItem('demo-setup-done');
    if (!setupDone) {
        const users = getUsers();
        if (!users['admin@example.com']) {
            users['admin@example.com'] = { hash: await hashPassword('admin123'), role: 'admin' };
        }
        if (!users['employee@example.com']) {
            users['employee@example.com'] = { hash: await hashPassword('employee123'), role: 'employee' };
        }
        saveUsers(users);
        localStorage.setItem('demo-setup-done', 'true');
        console.log("Demo accounts (admin@example.com, employee@example.com) created.");
    }
};
