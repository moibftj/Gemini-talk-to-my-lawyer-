
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { LETTER_TEMPLATES } from '../constants';
import { ShinyButton } from './magicui/shiny-button';
import { ShimmerButton } from './magicui/shimmer-button';
import { SparklesText } from './magicui/sparkles-text';
import { generateLetterDraft, LetterTone, LetterLength } from '../services/aiService';
import { isValidEmail } from '../lib/utils';
import type { LetterRequest, LetterTemplate } from '../types';

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

interface LetterRequestFormProps {
    onFormSubmit: (data: Omit<LetterRequest, 'id' | 'createdAt' | 'updatedAt'> | LetterRequest) => void;
    onCancel: () => void;
    letterToEdit?: LetterRequest | null;
}

export const LetterRequestForm: React.FC<LetterRequestFormProps> = ({ onFormSubmit, onCancel, letterToEdit }) => {
    const [title, setTitle] = useState('');
    const [selectedTemplateValue, setSelectedTemplateValue] = useState<string>(LETTER_TEMPLATES[0].value);
    const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
    const [tone, setTone] = useState<LetterTone>('Formal');
    const [length, setLength] = useState<LetterLength>('Medium');
    const [additionalContext, setAdditionalContext] = useState('');
    const [aiDraft, setAiDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for Recipient Send feature
    const [showRecipientSend, setShowRecipientSend] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientEmailError, setRecipientEmailError] = useState<string | null>(null);
    const [sendSuccess, setSendSuccess] = useState<string | null>(null);

    const isEditing = !!letterToEdit;
    const selectedTemplate = LETTER_TEMPLATES.find(t => t.value === selectedTemplateValue);

    useEffect(() => {
        if (letterToEdit) {
            setTitle(letterToEdit.title);
            setSelectedTemplateValue(letterToEdit.letterType);
            setTemplateFields(letterToEdit.templateData || {});
            setAdditionalContext(letterToEdit.description || ''); // 'description' field holds additional context now
            setAiDraft(letterToEdit.aiGeneratedContent || '');
        } else {
            // Reset form for new entry
            setTitle('');
            setSelectedTemplateValue(LETTER_TEMPLATES[0].value);
            setTemplateFields({});
            setAdditionalContext('');
            setAiDraft('');
        }
        setTone('Formal');
        setLength('Medium');
        setError(null);
        setShowRecipientSend(false);
        setRecipientEmail('');
        setRecipientEmailError(null);
        setSendSuccess(null);
    }, [letterToEdit]);
    
    // Reset template fields when template changes
    useEffect(() => {
        if (!isEditing) {
            setTemplateFields({});
        }
    }, [selectedTemplateValue, isEditing]);


    const handleTemplateFieldChange = (fieldName: string, value: string) => {
        setTemplateFields(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleGenerateDraft = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemplate) return;

        setIsLoading(true);
        setError(null);
        setAiDraft('');
        setShowRecipientSend(false);
        setSendSuccess(null);

        try {
            const generatedContent = await generateLetterDraft({
                title,
                templateBody: selectedTemplate.body,
                templateFields,
                additionalContext,
                tone,
                length,
            });
            setAiDraft(generatedContent);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveLetter = () => {
        if (isEditing) {
             onFormSubmit({
                ...letterToEdit,
                title,
                letterType: selectedTemplateValue,
                description: additionalContext,
                templateData: templateFields,
                aiGeneratedContent: aiDraft,
                status: 'draft', // Reset to draft on edit
            });
        } else {
            onFormSubmit({
                title,
                letterType: selectedTemplateValue,
                description: additionalContext,
                templateData: templateFields,
                aiGeneratedContent: aiDraft,
                status: 'draft',
                // Mocking data that would come from user session/db
                userId: 'user-1',
                recipientInfo: { name: templateFields["Recipient's Full Name"] || 'Recipient Name' },
                senderInfo: { name: 'Your Name' },
                priority: 'medium',
            });
        }
    };

    const handleRecipientEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setRecipientEmail(newEmail);
        if (newEmail && !isValidEmail(newEmail)) {
            setRecipientEmailError("Please enter a valid email address.");
        } else {
            setRecipientEmailError(null);
        }
    };
    
    const handleSendToRecipient = () => {
        console.log(`Simulating sending letter draft to: ${recipientEmail}`);
        console.log('--- DRAFT CONTENT ---');
        console.log(aiDraft);
        console.log('---------------------');
        setSendSuccess(`Draft successfully sent to ${recipientEmail}.`);
        
        // Hide the form after a few seconds for better UX
        setTimeout(() => {
            setShowRecipientSend(false);
            setSendSuccess(null);
            setRecipientEmail('');
            setRecipientEmailError(null);
        }, 5000);
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <form onSubmit={handleGenerateDraft}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Letter Request' : 'Create New Letter Request'}</CardTitle>
                        <CardDescription>Fill in the details below to generate a letter with AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Letter Subject</Label>
                            <Input id="title" placeholder="e.g., Final Demand for Payment" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="letter-type">Select a Template</Label>
                            <Select id="letter-type" value={selectedTemplateValue} onChange={e => setSelectedTemplateValue(e.target.value)}>
                                {LETTER_TEMPLATES.map(template => (
                                    <option key={template.value} value={template.value}>{template.label}</option>
                                ))}
                            </Select>
                            {selectedTemplate && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedTemplate.description}</p>}
                        </div>
                        
                        {selectedTemplate && selectedTemplate.requiredFields.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {selectedTemplate.requiredFields.map(field => (
                                    <div key={field} className="space-y-2">
                                        <Label htmlFor={`field-${field}`}>{field}</Label>
                                        <Input
                                            id={`field-${field}`}
                                            placeholder={`Enter ${field}`}
                                            value={templateFields[field] || ''}
                                            onChange={e => handleTemplateFieldChange(field, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tone">Tone of Voice</Label>
                                <Select id="tone" value={tone} onChange={e => setTone(e.target.value as LetterTone)}>
                                    <option>Formal</option>
                                    <option>Aggressive</option>
                                    <option>Conciliatory</option>
                                    <option>Neutral</option>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="length">Desired Length</Label>
                                <Select id="length" value={length} onChange={e => setLength(e.target.value as LetterLength)}>
                                    <option>Short</option>
                                    <option>Medium</option>
                                    <option>Long</option>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional-context">Additional Context (Optional)</Label>
                            <Textarea id="additional-context" placeholder="Provide any other details or context the AI should consider..." value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} />
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
                         <button type="button" onClick={onCancel} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                        {isLoading ? (
                           <ShinyButton type="submit" disabled className="w-full sm:w-auto">
                                Generating...
                           </ShinyButton>
                        ) : (
                            <ShimmerButton type="submit" className="w-full sm:w-auto">
                                Generate AI Draft
                            </ShimmerButton>
                        )}
                    </CardFooter>
                </form>
            </Card>

            <div className="lg:sticky top-8">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <SparklesText>AI Draft Preview</SparklesText>
                        </CardTitle>
                        <CardDescription>Review the AI-generated letter content below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                            </div>
                        )}
                        {error && (
                            <p className="text-sm text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md">{error}</p>
                        )}
                        
                        {!isLoading && !error && aiDraft && (
                            <div>
                                <pre className="text-sm whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">{aiDraft}</pre>
                                
                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button onClick={() => setShowRecipientSend(true)} className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                        Send via Attorney's Email
                                    </button>
                                    <ShimmerButton onClick={handleSaveLetter} disabled={!aiDraft}>
                                        Save Letter
                                    </ShimmerButton>
                                </div>

                                {showRecipientSend && (
                                    <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Send Draft</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Enter the email address to send a copy of this draft.</p>
                                        
                                        {sendSuccess ? (
                                            <p className="text-sm text-green-600 dark:text-green-500 text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">{sendSuccess}</p>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
                                                <div className="flex-grow">
                                                    <Input 
                                                        type="email" 
                                                        placeholder="email@example.com" 
                                                        value={recipientEmail}
                                                        onChange={handleRecipientEmailChange}
                                                        className="w-full text-sm"
                                                    />
                                                    {recipientEmailError && <p className="text-xs text-red-500 mt-1">{recipientEmailError}</p>}
                                                </div>
                                                <ShimmerButton 
                                                    onClick={handleSendToRecipient} 
                                                    disabled={!recipientEmail || !!recipientEmailError}
                                                    className="px-4 py-2 text-sm"
                                                >
                                                    Send
                                                </ShimmerButton>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {!isLoading && !error && !aiDraft && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-8">Your AI-generated draft will appear here once generated.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};