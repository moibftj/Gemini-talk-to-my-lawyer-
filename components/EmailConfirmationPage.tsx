import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { ShimmerButton } from './magicui/shimmer-button';
import { IconLogo } from '../constants';

const IconCheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

interface EmailConfirmationPageProps {
  onContinue: () => void;
}

export const EmailConfirmationPage: React.FC<EmailConfirmationPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <IconLogo className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        <span className="text-3xl font-bold text-gray-900 dark:text-white">Law Letter AI</span>
      </div>
      
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <IconCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            Email Confirmed!
          </CardTitle>
          <CardDescription className="text-base">
            Your account has been successfully verified. You can now access all features of Law Letter AI.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/10 p-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              Welcome to Law Letter AI! You're all set to start generating professional legal letters with AI assistance.
            </p>
          </div>
          
          <ShimmerButton onClick={onContinue} className="w-full">
            Continue to Dashboard
          </ShimmerButton>
        </CardContent>
      </Card>
    </div>
  );
};