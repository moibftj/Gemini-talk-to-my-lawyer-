// Based on ENUMs in the database schema
export type UserRole = 'user' | 'lawyer' | 'admin';
export type LetterType = 'demand_letter' | 'cease_and_desist' | 'defamation_slander' | 'breach_of_contract' | 'employment_dispute' | 'landlord_tenant' | 'debt_collection' | 'insurance_claim' | 'other';
export type LetterStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'completed' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type SubscriptionStatus = 'inactive' | 'active' | 'past_due' | 'cancelled' | 'unpaid';
export type MessageType = 'text' | 'system' | 'file';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';

// Based on letter_requests table
export interface LetterRequest {
  id: string; // UUID
  userId: string; // UUID
  lawyerId?: string; // UUID
  title: string;
  letterType: LetterType;
  description: string;
  recipientInfo: Record<string, any>; // JSONB
  senderInfo: Record<string, any>; // JSONB
  status: LetterStatus;
  priority: PriorityLevel;
  dueDate?: string; // DATE
  aiGeneratedContent?: string;
  finalContent?: string;
  createdAt: string; // TIMESTAMPTZ
  updatedAt: string; // TIMESTAMPTZ
}

// Fix: Add missing types for an unintegrated project analysis feature.
export interface Task {
    name: string;
    completed: boolean;
    isSubtask?: boolean;
}

export interface Phase {
    id: number | string;
    title: string;
    status: string;
    tasks: Task[];
}

export interface DbStep {
    id: number | string;
    title: string;
    tasks: string[];
}
