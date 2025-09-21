import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { LETTER_TEMPLATES, IconSpinner } from '../constants';
import { ShinyButton } from './magicui/shiny-button';
import { ShimmerButton } from './magicui/shimmer-button';
import { SparklesText } from './magicui/sparkles-text';
import { generateLetterDraft, LetterTone, LetterLength } from '../services/aiService';
import { isValidEmail } from '../lib/utils';
import type { LetterRequest, LetterTemplate } from '../types';
import { Label, Input, Select, Textarea } from './Form';
import { apiClient } from '../services/apiClient';
import { storageService } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';

const IconDownload: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconPaperclip: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const FormattedDraft: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\[Information Not Provided\])/g);
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-300">
      <p className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part === '[Information Not Provided]') {
            return (
              <strong key={index} className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-1 rounded-sm">
                {part}
              </strong>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    </div>
  );
};

interface LetterRequestFormProps {
  onFormSubmit: (letterData: Partial<LetterRequest>) => Promise<void>;
  onCancel: () => void;
  letterToEdit?: LetterRequest | null;
}

export const LetterRequestForm: React.FC<LetterRequestFormProps> = ({ onFormSubmit, onCancel, letterToEdit }) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [tone, setTone] = useState<LetterTone>('Formal');
  const [length, setLength] = useState<LetterLength>('Medium');
  
  const [aiDraft, setAiDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [showSendForm, setShowSendForm] = useState(false);
  const [attorneyEmail, setAttorneyEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // File upload states
  const [attachments, setAttachments] = useState<{ name: string; url: string; path: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (letterToEdit) {
      const template = LETTER_TEMPLATES.find(t => t.value === letterToEdit.letterType) || null;
      setSelectedTemplate(template);
      setTitle(letterToEdit.title);
      setFormData(letterToEdit.templateData || {});
      setAdditionalContext(letterToEdit.description || '');
      setAiDraft(letterToEdit.aiGeneratedContent || '');
    } else {
        // Set default template
        const defaultTemplate = LETTER_TEMPLATES[0];
        setSelectedTemplate(defaultTemplate);
        setFormData(
          defaultTemplate.requiredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
        );
    }
  }, [letterToEdit]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = LETTER_TEMPLATES.find(t => t.value === e.target.value) || null;
    setSelectedTemplate(template);
    setFormData(
      template ? template.requiredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}) : {}
    );
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerateDraft = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    setError(null);
    setAiDraft('');
    try {
      const draft = await generateLetterDraft({
        title,
        templateBody: selectedTemplate.body,
        templateFields: formData,
        additionalContext,
        tone,
        length,
      });
      setAiDraft(draft);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file: File) => {
        const result = await storageService.uploadFile(file, user.email);
        return {
          name: file.name,
          url: result.url,
          path: result.path
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = async (index: number) => {
    const attachment = attachments[index];
    try {
      await storageService.deleteFile(attachment.path);
      setAttachments(prev => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      console.error('Failed to delete attachment:', err);
      // Still remove from UI even if deletion fails
      setAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveLetter = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    setError(null); // Clear previous errors
    try {
        const letterData: Partial<LetterRequest> = {
            id: letterToEdit?.id, // Keep id if editing
            title,
            letterType: selectedTemplate.value,
            description: additionalContext,
            templateData: formData,
            aiGeneratedContent: aiDraft,
            status: letterToEdit?.status || 'draft',
            priority: letterToEdit?.priority || 'medium',
            // Store attachment URLs in the letter data
            attachments: attachments.map(att => ({ name: att.name, url: att.url })),
        };
        await onFormSubmit(letterData);
    } catch (err: any) {
        console.error("Failed to save letter:", err);
        setError(err.message || "Could not save the letter. An unexpected error occurred.");
    } finally {
        setIsSaving(false);
    }
  };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setSendError(null);
        setSendSuccess(false);

        try {
            await apiClient.sendDraftByEmail({
                to: attorneyEmail,
                subject: `Review Draft: ${title || 'Untitled Letter'}`,
                html: `<p>Please review the following draft:</p><hr>${aiDraft.replace(/\n/g, '<br>')}`
            });
            setSendSuccess(true);
            setTimeout(() => {
                setShowSendForm(false);
                setSendSuccess(false);
                setAttorneyEmail('');
            }, 3000);
        } catch (err: any) {
            setSendError(err.message || 'An unexpected error occurred while sending the email.');
        } finally {
            setIsSending(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setAttorneyEmail(email);
        if (email && !isValidEmail(email)) {
            setEmailError("Please enter a valid email.");
        } else {
            setEmailError(null);
        }
    };
    
    const handleExportPdf = () => {
        if (!aiDraft) return;
        setIsExporting(true);
        // Simulate processing time
        setTimeout(() => {
            const doc = new jsPDF();
            const margin = 15;
            const pageWidth = doc.internal.pageSize.getWidth();
            const usableWidth = pageWidth - margin * 2;
            
            doc.setFontSize(16);
            doc.text(title, pageWidth / 2, margin, { align: 'center' });
            
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(aiDraft, usableWidth);
            doc.text(lines, margin, margin + 15);
            
            const safeFilename = title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'letter_draft';
            doc.save(`${safeFilename}.pdf`);
            setIsExporting(false);
        }, 500);
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>{letterToEdit ? 'Edit Letter' : 'Create a New Letter'}</CardTitle>
          <CardDescription>Fill in the details below to generate an AI-powered draft.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template">Select a Template</Label>
            <Select id="template" value={selectedTemplate?.value || ''} onChange={handleTemplateChange}>
              {LETTER_TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
            {selectedTemplate && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedTemplate.description}</p>}
          </div>

          {selectedTemplate && selectedTemplate.requiredFields.map(field => (
            <div key={field}>
              <Label htmlFor={field}>{field}</Label>
              <Input id={field} value={formData[field] || ''} onChange={(e) => handleFieldChange(field, e.target.value)} />
            </div>
          ))}

          <div>
            <Label htmlFor="title">Subject / Title of Letter</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Final Demand for Payment" />
          </div>

          <div>
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea id="context" value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} placeholder="Provide any extra details the AI should consider..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <Label htmlFor="tone">Tone of Voice</Label>
                <Select id="tone" value={tone} onChange={e => setTone(e.target.value as LetterTone)}>
                    <option>Formal</option>
                    <option>Aggressive</option>
                    <option>Conciliatory</option>
                    <option>Neutral</option>
                </Select>
            </div>
             <div>
                <Label htmlFor="length">Desired Length</Label>
                <Select id="length" value={length} onChange={e => setLength(e.target.value as LetterLength)}>
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Long</option>
                </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <div className="mt-1">
              <input
                id="attachments"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
              />
              {isUploading && <p className="text-sm text-blue-600 mt-1">Uploading files...</p>}
              {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
            </div>
            
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconPaperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <button onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Cancel</button>
          {isGenerating ? (
            <ShinyButton disabled>
                <SparklesText>Generating...</SparklesText>
            </ShinyButton>
          ) : (
            <ShimmerButton onClick={handleGenerateDraft}>Generate AI Draft</ShimmerButton>
          )}
        </CardFooter>
      </Card>
      
      <div className="lg:sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>AI Draft Preview</CardTitle>
            <CardDescription>The AI-generated content will appear here for your review.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
            {isGenerating && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {!isGenerating && !error && aiDraft && <FormattedDraft text={aiDraft} />}
            {!isGenerating && !error && !aiDraft && <p className="text-sm text-gray-500">Your draft will be displayed here once generated.</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-stretch pt-6">
             <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button onClick={handleExportPdf} disabled={!aiDraft || isExporting} className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isExporting ? <IconSpinner className="w-4 h-4 animate-spin" /> : <IconDownload className="w-4 h-4" />}
                    {isExporting ? 'Exporting...' : 'Export as PDF'}
                </button>
                <button 
                  onClick={() => { setShowSendForm(prev => !prev); setSendSuccess(false); setSendError(null); }}
                  disabled={!aiDraft}
                  className="text-sm font-medium px-4 py-2 rounded-md transition-colors border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send via Attorney's Email
                </button>
                 <ShimmerButton onClick={handleSaveLetter} disabled={!aiDraft || isSaving}>
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                            <IconSpinner className="h-4 w-4 animate-spin" />
                            Saving...
                        </span>
                    ) : (
                        'Save Letter'
                    )}
                </ShimmerButton>
             </div>
             {showSendForm && (
                 <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 mt-2">
                    {sendSuccess ? (
                        <p className="text-sm text-center text-green-600 dark:text-green-500">Draft sent successfully!</p>
                    ) : (
                        <form onSubmit={handleSendEmail} className="space-y-3">
                            <h4 className="text-sm font-semibold">Send Draft</h4>
                            <div>
                                <Label htmlFor="attorney-email" className="sr-only">Email address</Label>
                                <Input 
                                    id="attorney-email" 
                                    type="email" 
                                    placeholder="email address"
                                    value={attorneyEmail}
                                    onChange={handleEmailChange}
                                    required
                                />
                                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                            </div>
                            <ShimmerButton type="submit" className="w-full" disabled={!attorneyEmail || !!emailError || isSending}>
                                 {isSending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <IconSpinner className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    'Send'
                                )}
                            </ShimmerButton>
                            {sendError && <p className="text-xs text-red-500 mt-1 text-center">{sendError}</p>}
                        </form>
                    )}
                 </div>
             )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
