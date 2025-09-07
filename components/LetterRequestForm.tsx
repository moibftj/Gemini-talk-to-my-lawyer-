import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { LETTER_TEMPLATES } from '../constants';
import { ShinyButton } from './magicui/shiny-button';
import { ShimmerButton } from './magicui/shimmer-button';
import { SparklesText } from './magicui/sparkles-text';
import { generateLetterDraft, LetterTone, LetterLength } from '../services/aiService';
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
    
    const renderPreviewContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
            );
        }
        if (error) {
            return <p className="text-sm text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md">{error}</p>
        }
        if (!aiDraft) {
            return <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-8">The AI-generated letter draft will appear here after you click "Generate".</p>;
        }
        return <p className="text-sm whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-800">{aiDraft}</p>;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="lg:sticky lg:top-8">
                <CardHeader>
                    <CardTitle>
                        <SparklesText>{isEditing ? 'Edit Letter Request' : 'Create New Letter Request'}</SparklesText>
                    </CardTitle>
                    <CardDescription>{isEditing ? 'Update the details below to regenerate the letter draft.' : 'Fill in the details below to generate a new letter draft with AI.'}</CardDescription>
                </CardHeader>
                <form onSubmit={handleGenerateDraft}>
                    <CardContent className="space-y-6">
                        <div className="space-y-1">
                            <Label htmlFor="title">Letter Title</Label>
                            <Input id="title" placeholder="e.g., Final Demand for Unpaid Invoice #XYZ-123" required value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="template">Select a Template</Label>
                            <Select id="template" required value={selectedTemplateValue} onChange={e => setSelectedTemplateValue(e.target.value)}>
                                {LETTER_TEMPLATES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </Select>
                            {selectedTemplate && <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">{selectedTemplate.description}</p>}
                        </div>

                        {selectedTemplate && selectedTemplate.requiredFields.map(field => (
                            <div className="space-y-1" key={field}>
                                <Label htmlFor={field}>{field}</Label>
                                <Input
                                    id={field}
                                    placeholder={`Enter ${field}`}
                                    required
                                    value={templateFields[field] || ''}
                                    onChange={e => handleTemplateFieldChange(field, e.target.value)}
                                />
                            </div>
                        ))}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="tone">Tone of Voice</Label>
                                <Select id="tone" required value={tone} onChange={e => setTone(e.target.value as LetterTone)}>
                                    <option value="Formal">Formal</option>
                                    <option value="Aggressive">Aggressive</option>
                                    <option value="Conciliatory">Conciliatory</option>
                                    <option value="Neutral">Neutral</option>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="length">Desired Length</Label>
                                <Select id="length" required value={length} onChange={e => setLength(e.target.value as LetterLength)}>
                                    <option value="Short">Short (Concise)</option>
                                    <option value="Medium">Medium (Standard)</option>
                                    <option value="Long">Long (Detailed)</option>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description">Additional Context (Optional)</Label>
                            <Textarea id="description" placeholder="Provide any other details or context the AI should consider when filling out the template." rows={4} value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end space-x-2">
                        <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-300 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                        
                        {isLoading ? (
                            <ShinyButton disabled>
                                <span className="flex items-center justify-center">
                                    {isEditing ? 'Updating...' : 'Generating...'}
                                </span>
                            </ShinyButton>
                        ) : (
                            <ShimmerButton type="submit" disabled={!title || !selectedTemplate || Object.keys(templateFields).length < selectedTemplate.requiredFields.length}>
                                {isEditing ? 'Regenerate Draft' : 'Generate AI Draft'}
                            </ShimmerButton>
                        )}
                    </CardFooter>
                </form>
            </Card>

            <Card className="lg:sticky lg:top-8">
                <CardHeader>
                    <CardTitle>
                        <SparklesText>AI Draft Preview</SparklesText>
                    </CardTitle>
                    <CardDescription>Review the generated content below. You can edit the form and regenerate if needed.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[340px]">
                    {renderPreviewContent()}
                </CardContent>
                <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end">
                    <ShimmerButton onClick={handleSaveLetter} disabled={!aiDraft || isLoading}>
                        Save Letter
                    </ShimmerButton>
                </CardFooter>
            </Card>
        </div>
    );
}