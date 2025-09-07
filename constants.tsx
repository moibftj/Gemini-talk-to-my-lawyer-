import React from 'react';
import type { LetterRequest, LetterStatus, LetterTemplate } from './types';

export const LETTER_TEMPLATES: LetterTemplate[] = [
    {
        value: 'general_demand_letter',
        label: 'General Demand Letter',
        description: 'A formal request for a specific action, usually payment of a debt.',
        requiredFields: ["Recipient's Full Name", "Amount Owed", "Reason for Debt", "Deadline for Action"],
        body: `Dear [Recipient's Full Name],

This letter serves as a formal demand for payment in the amount of $[Amount Owed]. This debt is in relation to [Reason for Debt].

We have previously attempted to resolve this matter without success. Your immediate attention to this issue is required.

Please submit the full payment of $[Amount Owed] by [Deadline for Action]. Payment can be made to [Your Name] via [Preferred Payment Method].

If we do not receive payment or hear from you by the specified deadline, we will be forced to consider further legal action to recover the debt, which may include but is not limited to, filing a lawsuit.

This is an attempt to collect a debt, and any information obtained will be used for that purpose.

Sincerely,
[Your Name]
[Your Company Name, if applicable]
[Your Address]
[Your Phone Number]
[Your Email]`
    },
    {
        value: 'cease_and_desist_harassment',
        label: 'Cease and Desist (Harassment)',
        description: 'A letter demanding that an individual or group stop a specified unwanted action.',
        requiredFields: ["Recipient's Full Name", "Description of Harassing Conduct", "Date(s) of Incidents", "Demanded Action"],
        body: `Dear [Recipient's Full Name],

This letter is a formal demand that you immediately CEASE AND DESIST all forms of harassment directed towards me, [Your Name].

The harassing conduct includes, but is not limited to, the following: [Description of Harassing Conduct]. These actions occurred on or around the following date(s): [Date(s) of Incidents].

Your actions are causing significant distress and are a violation of my legal rights. I demand that you [Demanded Action] and have no further contact with me, my family, or my associates, whether in person, by phone, in writing, or through any third party.

Failure to comply with this demand immediately will result in me seeking all available legal remedies against you, including but not limited to, filing for a restraining order and pursuing civil action for damages.

This letter is formal notice to you that your actions are not welcome and must stop. Governed by the laws of [Your State/Jurisdiction].

Sincerely,
[Your Name]`
    }
];

export const getTemplateLabel = (value: string): string => {
    const template = LETTER_TEMPLATES.find(t => t.value === value);
    return template ? template.label : value.replace(/_/g, ' ');
};

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
    letterType: 'general_demand_letter',
    status: 'in_review',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T12:30:00Z',
    userId: 'user-1',
    description: 'A demand for an unpaid invoice from a client.',
    recipientInfo: { name: 'Client Corp' },
    senderInfo: { name: 'My Company' },
    priority: 'medium',
    templateData: {
      "Recipient's Full Name": 'Client Corp',
      "Amount Owed": '5,000',
      "Reason for Debt": 'Unpaid invoice #123 for consulting services.',
      "Deadline for Action": 'November 15, 2023',
    }
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

export const IconEdit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

export const IconDollarSign: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

export const IconUsers: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export const IconStar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export const IconTrash: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);