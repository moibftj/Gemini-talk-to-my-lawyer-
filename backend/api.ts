import { GoogleGenAI } from "@google/genai";
import * as db from './db';
import { hashPassword } from './utils';
import { creditAffiliate, initializeMockAffiliates } from '../lib/affiliate';
import type { User, UserRole, LetterRequest } from '../types';
import type { LetterTone, LetterLength } from '../services/aiService';

// This file simulates a backend API. In a real app, these would be API endpoints
// (e.g., in an Express.js server) that the frontend would call via HTTP requests.

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- AUTH API ---

export const signup = async (email: string, password: string, role: UserRole, affiliateCode?: string): Promise<{ user: User, token: string }> => {
    await delay(500);
    const users = db.getUsers();
    
    if (users[email.toLowerCase()]) {
      throw new Error("User with this email already exists.");
    }
    
    const passwordHash = await hashPassword(password);
    users[email.toLowerCase()] = { hash: passwordHash, role };
    db.saveUsers(users);

    if (affiliateCode) {
        creditAffiliate(affiliateCode, {
            userEmail: email,
            subscriptionAmount: 50, // Mocked
            usedDiscount: Math.random() > 0.5,
        });
    }

    return login(email, password);
};

export const login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(500);
    const users = db.getUsers();
    const userData = users[email.toLowerCase()];

    if (!userData) throw new Error("User not found.");

    const passwordHash = await hashPassword(password);
    if (passwordHash !== userData.hash) throw new Error("Invalid password.");
    
    const user: User = { email, role: userData.role };
    const token = `session-token-${Date.now()}`;
    return { user, token };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    await delay(500);
    const users = db.getUsers();
    if (!users[email.toLowerCase()]) {
        console.log(`Password reset requested for non-existent user: ${email}`);
        return; // Don't reveal if user exists
    }

    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const expiry = Date.now() + 15 * 60 * 1000; // 15 mins
    
    const resetTokens = db.getResetTokens();
    resetTokens[resetToken] = { email, expiry };
    db.saveResetTokens(resetTokens);

    const resetUrl = `${window.location.origin}${window.location.pathname}?reset_token=${resetToken}`;
    console.log("--- PASSWORD RESET SIMULATION (FROM BACKEND) ---");
    console.log(`Reset Link for ${email}: ${resetUrl}`);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await delay(500);
    const resetTokens = db.getResetTokens();
    const tokenData = resetTokens[token];

    if (!tokenData || tokenData.expiry < Date.now()) {
        throw new Error("Invalid or expired password reset token.");
    }
    
    const { email } = tokenData;
    const users = db.getUsers();
    if (!users[email.toLowerCase()]) {
        throw new Error("User associated with token not found.");
    }
    
    users[email.toLowerCase()].hash = await hashPassword(newPassword);
    db.saveUsers(users);

    delete resetTokens[token];
    db.saveResetTokens(resetTokens);
};


// --- LETTER DATA API ---

export const fetchLetters = async (): Promise<LetterRequest[]> => {
    await delay(1000); // Simulate network latency
    return db.getLetters();
};

export const createLetter = async (letterData: Omit<LetterRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<LetterRequest> => {
    await delay(500);
    const letters = db.getLetters();
    const newLetter: LetterRequest = {
        ...letterData,
        id: `letter-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const updatedLetters = [newLetter, ...letters];
    db.saveLetters(updatedLetters);
    return newLetter;
};

export const updateLetter = async (letterData: LetterRequest): Promise<LetterRequest> => {
    await delay(500);
    const letters = db.getLetters();
    const updatedLetter = { ...letterData, updatedAt: new Date().toISOString() };
    const updatedLetters = letters.map(l => l.id === updatedLetter.id ? updatedLetter : l);
    db.saveLetters(updatedLetters);
    return updatedLetter;
};

export const deleteLetter = async (id: string): Promise<void> => {
    await delay(1000);
    const letters = db.getLetters();
    const updatedLetters = letters.filter(l => l.id !== id);
    db.saveLetters(updatedLetters);
};

// --- ADMIN API ---

export const fetchAllUsers = async (): Promise<{ email: string, role: UserRole }[]> => {
    await delay(1000);
    const users = db.getUsers();
    return Object.entries(users).map(([email, data]) => ({ email, role: data.role }));
};


// --- AI SERVICE API ---

interface GenerateDraftPayload {
    title: string;
    templateBody: string;
    templateFields: Record<string, string>;
    additionalContext: string;
    tone?: LetterTone;
    length?: LetterLength;
}
export const generateDraft = async (payload: GenerateDraftPayload): Promise<string> => {
    // THIS IS THE SECURE, BACKEND-ONLY GEMINI API CALL
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set on server.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";

    let styleInstructions = '';
    if (payload.tone || payload.length) {
        styleInstructions += '\n**Tone & Style Instructions:**\n';
        if (payload.tone) styleInstructions += `- **Tone:** The tone of the letter should be professional and ${payload.tone.toLowerCase()}.\n`;
        if (payload.length) {
            let lengthDesc = '';
            switch (payload.length) {
                case 'Short': lengthDesc = 'concise and to the point.'; break;
                case 'Medium': lengthDesc = 'standard, with sufficient detail.'; break;
                case 'Long': lengthDesc = 'comprehensive and highly detailed.'; break;
            }
            styleInstructions += `- **Length:** The filled-in sections should be relatively ${payload.length.toLowerCase()}, resulting in a letter that is ${lengthDesc}\n`;
        }
    }

    const prompt = `
        You are an expert legal assistant. Your task is to complete the following letter template using the user-provided details.
        The letter's subject is "${payload.title}".
        **Template to complete:**
        ---
        ${payload.templateBody}
        ---
        **User-provided details to fill in the placeholders:**
        ${Object.entries(payload.templateFields).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
        **Additional Context from the user (incorporate this where relevant):**
        ${payload.additionalContext || 'No additional context provided.'}
        ${styleInstructions}
        **Instructions:**
        1.  Carefully replace the placeholders (e.g., [Your Name], [Amount Owed]) in the template with the corresponding user-provided details.
        2.  If a detail for a placeholder is not provided, you MUST replace it with a clear indicator like "[Information Not Provided]" in the final letter. Do not leave the original placeholder (e.g., [Amount Owed]) in the text.
        3.  Incorporate the "Additional Context" where it seems most relevant within the letter body to add necessary detail or clarify points.
        4.  Ensure the final letter flows naturally and is grammatically correct after filling in the details.
        5.  Adhere strictly to the Tone & Style instructions when filling in the template.
        6.  The entire response should be ONLY the completed body of the letter. Do not include a subject line, greetings, sign-offs, or explanations outside of the letter's content itself.
    `;

    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API from backend:", error);
        throw new Error("Failed to generate letter draft from AI.");
    }
};

// --- BACKEND INITIALIZATION ---
// This would run on server startup
export const initializeBackend = () => {
    db.initializeDemoData();
    initializeMockAffiliates();
};
