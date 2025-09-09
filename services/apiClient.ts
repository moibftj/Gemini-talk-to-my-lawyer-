import supabase from './supabase';
import type { LetterRequest } from '../types';
import type { LetterTone, LetterLength } from './aiService';

// This file is the single source of truth for all frontend-to-backend communication.
// It uses the Supabase client to interact with the database and Edge Functions.

const handleSupabaseError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    // Handle specific error types for better UX
    if (error.code === 'PGRST301') {
        throw new Error('Access denied. Please check your permissions.');
    }
    if (error.code === '23505') {
        throw new Error('This item already exists.');
    }
    if (error.message?.includes('JWT')) {
        throw new Error('Your session has expired. Please sign in again.');
    }
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(error.message || `An unexpected error occurred in ${context}.`);
};

// Retry utility for handling transient network errors
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && (
            error.message?.includes('network') || 
            error.message?.includes('fetch') ||
            error.code === 'ECONNRESET' ||
            error.code === 'ETIMEDOUT'
        )) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 1.5);
        }
        throw error;
    }
};

// Helper to map Supabase's snake_case to our app's camelCase
const mapLetterFromSupabase = (l: any): LetterRequest => ({
    id: l.id,
    userId: l.user_id,
    lawyerId: l.lawyer_id,
    title: l.title,
    letterType: l.letter_type,
    description: l.description,
    recipientInfo: l.recipient_info,
    senderInfo: l.sender_info,
    status: l.status,
    priority: l.priority,
    dueDate: l.due_date,
    aiGeneratedContent: l.ai_generated_content,
    templateData: l.template_data,
    finalContent: l.final_content,
    createdAt: l.created_at,
    updatedAt: l.updated_at,
});


// --- LETTERS API (DATABASE) ---

const fetchLetters = async (): Promise<LetterRequest[]> => {
    return withRetry(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('letters')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error, 'fetchLetters');
        return (data || []).map(mapLetterFromSupabase);
    });
};

const createLetter = async (letterData: Partial<LetterRequest>): Promise<LetterRequest> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const letterToInsert = {
        user_id: user.id,
        title: letterData.title,
        letter_type: letterData.letterType,
        description: letterData.description,
        template_data: letterData.templateData,
        ai_generated_content: letterData.aiGeneratedContent,
        status: letterData.status || 'draft',
        priority: letterData.priority || 'medium',
        recipient_info: letterData.recipientInfo || {},
        sender_info: letterData.senderInfo || {},
    };

    const { data, error } = await supabase
        .from('letters')
        .insert(letterToInsert)
        .select()
        .single();
    
    if (error) handleSupabaseError(error, 'createLetter');
    return mapLetterFromSupabase(data);
};

const updateLetter = async (letterData: LetterRequest): Promise<LetterRequest> => {
    const letterToUpdate = {
        title: letterData.title,
        letter_type: letterData.letterType,
        description: letterData.description,
        template_data: letterData.templateData,
        ai_generated_content: letterData.aiGeneratedContent,
        status: letterData.status,
        priority: letterData.priority,
        updated_at: new Date().toISOString(), // Manually update timestamp
    };
    
    const { data, error } = await supabase
        .from('letters')
        .update(letterToUpdate)
        .eq('id', letterData.id)
        .select()
        .single();
    
    if (error) handleSupabaseError(error, 'updateLetter');
    return mapLetterFromSupabase(data);
};

const deleteLetter = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('letters')
        .delete()
        .eq('id', id);

    if (error) handleSupabaseError(error, 'deleteLetter');
};

// --- AI SERVICE API (EDGE FUNCTION) ---
interface GenerateDraftPayload {
    title: string;
    templateBody: string;
    templateFields: Record<string, string>;
    additionalContext: string;
    tone?: LetterTone;
    length?: LetterLength;
}
const generateDraft = async (payload: GenerateDraftPayload): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('generate-draft', {
        body: payload,
    });

    if (error) handleSupabaseError(error, 'generateDraft function');
    if (data.error) throw new Error(data.error);
    return data.draft;
};

// --- ADMIN API (EDGE FUNCTIONS) ---

const fetchAllUsers = async (): Promise<{ id: string; email: string | undefined; role: string | undefined; }[]> => {
    const { data, error } = await supabase.functions.invoke('get-all-users');
    if (error) handleSupabaseError(error, 'fetchAllUsers function');
    return data.users;
};

const fetchAllLetters = async (): Promise<any[]> => {
    const { data, error } = await supabase.functions.invoke('get-all-letters');
    if (error) handleSupabaseError(error, 'fetchAllLetters function');
    return data.letters;
};


export const apiClient = {
    // Letters (Database)
    fetchLetters,
    createLetter,
    updateLetter,
    deleteLetter,

    // AI Service (Edge Function)
    generateDraft,

    // Admin (Edge Functions)
    fetchAllUsers,
    fetchAllLetters,
};