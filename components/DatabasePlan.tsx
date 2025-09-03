import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { LETTER_TYPE_OPTIONS } from '../constants';

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


export const LetterRequestForm: React.FC<{ onFormSubmit: () => void, onCancel: () => void }> = ({ onFormSubmit, onCancel }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally handle form data and call the AI service
        console.log("Form submitted");
        // For now, just return to dashboard
        onFormSubmit();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Letter Request</CardTitle>
                <CardDescription>Fill in the details below to generate a new letter draft.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-1">
                        <Label htmlFor="title">Letter Title</Label>
                        <Input id="title" placeholder="e.g., Final Demand for Payment" required />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="letterType">Letter Type</Label>
                        <Select id="letterType" required>
                            {LETTER_TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Key Details / Description</Label>
                        <Textarea id="description" placeholder="Provide all necessary details, facts, dates, and amounts to include in the letter." rows={6} required/>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 justify-end space-x-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate Draft</button