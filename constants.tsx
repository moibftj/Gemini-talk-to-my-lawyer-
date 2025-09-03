import React from 'react';
import type { LetterRequest, LetterType, LetterStatus } from './types';

export const LETTER_TYPE_OPTIONS: { value: LetterType, label: string }[] = [
    { value: 'demand_letter', label: 'Demand Letter' },
    { value: 'cease_and_desist', label: 'Cease and Desist' },
    { value: 'defamation_slander', label: 'Defamation/Slander' },
    { value: 'breach_of_contract', label: 'Breach of Contract' },
    { value: 'employment_dispute', label: 'Employment Dispute' },
    { value: 'landlord_tenant', label: 'Landlord/Tenant' },
    { value: 'debt_collection', label: 'Debt Collection' },
    { value: 'insurance_claim', label: 'Insurance Claim' },
    { value: 'other', label: 'Other' },
];

export const STATUS_STYLES: Record<LetterStatus, { bg: string, text: string }> = {
  draft: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300' },
  submitted: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400' },
  in_review: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-600 dark:text-yellow-400' },
  approved: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400' },
  completed: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400' },
};

export const MOCK_LETTERS: LetterRequest[] = [
  {
    id: '1',
    title: 'Demand for Payment - Invoice #123',
    letterType: 'debt_collection',
    status: 'in_review',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T12:30:00Z',
    userId: 'user-1',
    description: 'A demand for an unpaid invoice from a client.',
    recipientInfo: { name: 'Client Corp' },
    senderInfo: { name: 'My Company' },
    priority: 'medium',
  },
  {
    id: '2',
    title: 'Cease and Desist - Trademark Infringement',
    letterType: 'cease_and_desist',
    status: 'completed',
    createdAt: '2023-10-25T14:00:00Z',
    updatedAt: '2023-10-27T09:00:00Z',
    userId: 'user-1',
    description: 'Letter to a competitor for using our trademarked logo.',
    recipientInfo: { name: 'Competitor Inc.' },
    senderInfo: { name: 'My Company' },
    priority: 'high',
  },
  {
    id: '3',
    title: 'Notice of Breach of Contract',
    letterType: 'breach_of_contract',
    status: 'draft',
    createdAt: '2023-10-27T11:00:00Z',
    updatedAt: '2023-10-27T11:00:00Z',
    userId: 'user-1',
    description: 'Initial draft for a supplier failing to meet delivery deadlines.',
    recipientInfo: { name: 'Supplier LLC' },
    senderInfo: { name: 'My Company' },
    priority: 'medium',
  }
];

// Icons
export const IconFilePlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
);

export const IconLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect x="2" y="10" width="4" height="10"></rect><rect x="18" y="10" width="4" height="10"></rect></svg>
);

export const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
