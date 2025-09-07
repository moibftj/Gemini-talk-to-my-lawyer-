import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { LETTER_TYPE_OPTIONS } from '../constants';
import { ShinyButton } from './magicui/shiny-button';
import { ShimmerButton } from './magicui/shimmer-button';
import { SparklesText } from './magicui/sparkles-text';
import { generateLetterDraft } from '../services/aiService';
import type { LetterRequest, LetterType } from '../types';

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`} {...props} />
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input className={`mt-1 flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
    <textarea className={`mt-1 flex min-h-[120px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => (
    <select className={`mt-1 flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>
        {children}
    </select>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
        <span className="text-sm text-slate-500 dark:text-slate-400">AI is drafting your letter...</span>
    </div>
);

interface LetterRequestFormProps {
    onFormSubmit: (data: Omit<LetterRequest, 'id' | 'createdAt' | 'updatedAt'> | LetterRequest) => void;
    onCancel: () => void;
    letterToEdit?: LetterRequest | null;
}

export const LetterRequestForm: React.FC<LetterRequestFormProps> = ({ onFormSubmit, onCancel, letterToEdit }) => {
    const [title, setTitle] = useState('');
    const [letterType, setLetterType] = useState<LetterType>('demand_letter');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!letterToEdit;

    useEffect(() => {
        if (letterToEdit) {
            setTitle(letterToEdit.title);
            setLetterType(letterToEdit.letterType);
            setDescription(letterToEdit.description);
        } else {
            // Reset form when switching from edit to create
            setTitle('');
            setLetterType('demand_letter');
            setDescription('');
        }
    }, [letterToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const aiGeneratedContent = await generateLetterDraft({ title, letterType, description });
            
            if (isEditing) {
                 onFormSubmit({
                    ...letterToEdit,
                    title,
                    letterType,
                    description,
                    aiGeneratedContent,
                    status: 'draft', // Reset to draft on edit
                });
            } else {
                onFormSubmit({
                    title,
                    letterType,
                    description,
                    aiGeneratedContent,
                    status: 'draft',
                    // Mocking data that would come from user session/db
                    userId: 'user-1',
                    recipientInfo: { name: 'Recipient Name' },
                    senderInfo: { name: 'Your Name' },
                    priority: 'medium',
                });
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <SparklesText>{isEditing ? 'Edit Letter Request' : 'Create New Letter Request'}</SparklesText>
                </CardTitle>
                <CardDescription>{isEditing ? 'Update the details below to regenerate the letter draft.' : 'Fill in the details below to generate a new letter draft with AI.'}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-1">
                        <Label htmlFor="title">Letter Title</Label>
                        <Input id="title" placeholder="e.g., Final Demand for Unpaid Invoice #XYZ-123" required value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="letterType">Letter Type</Label>
                        <Select id="letterType" required value={letterType} onChange={e => setLetterType(e.target.value as LetterType)}>
                            {LETTER_TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Key Details & Context</Label>
                        <Textarea id="description" placeholder="Provide all necessary details, facts, dates, amounts, and what you want to achieve. The more context you give the AI, the better the draft will be." rows={6} required value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex-col items-stretch gap-4">
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-300 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                        
                        {isLoading ? (
                            <ShinyButton disabled>
                                {isEditing ? 'Updating...' : 'Generating...'}
                            </ShinyButton>
                        ) : (
                            <ShimmerButton type="submit" disabled={!title || !description}>
                                {isEditing ? 'Update & Regenerate Draft' : 'Generate AI Draft'}
                            </ShimmerButton>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}