import React, { useState } from 'react';
import { Spotlight } from './magicui/spotlight';
import { SparklesText } from './magicui/sparkles-text';
import { ShimmerButton } from './magicui/shimmer-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { SubscriptionModal } from './SubscriptionModal';
import { IconLogo, IconUsers, IconFilePlus } from '../constants';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const [showSubscribe, setShowSubscribe] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Spotlight className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-b-2xl border-b border-slate-800 bg-gradient-to-br from-gray-950 to-slate-900 py-20">
        <div className="absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-6xl px-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconLogo className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-semibold text-white">Law Letter AI</span>
            </div>
            <div className="flex gap-2">
              <button onClick={onLogin} className="px-4 py-2 rounded-md border border-slate-700 text-gray-200 hover:bg-slate-800">Log in</button>
              <ShimmerButton onClick={onSignup}>Sign up</ShimmerButton>
            </div>
          </header>

          <div className="mt-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100">
              <SparklesText>Letters drafted. Attorneys approved.</SparklesText>
            </h1>
            <p className="mt-4 text-lg text-gray-400">Generate legal-grade letters with AI and attorney oversight.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <ShimmerButton onClick={onSignup}>Start free</ShimmerButton>
              <button onClick={onLogin} className="px-4 py-2 rounded-md border border-slate-700 text-gray-200 hover:bg-slate-800">I already have an account</button>
            </div>
          </div>
        </div>
      </Spotlight>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Preview the process</CardTitle>
              <CardDescription>Login to continue and complete each step.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <div className="text-sm text-gray-500">Simplified Letter Form</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm" placeholder="Recipient name" readOnly />
                    <input className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm" placeholder="Reason" readOnly />
                    <input className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm" placeholder="Amount" readOnly />
                    <input className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm" placeholder="Deadline" readOnly />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <ShimmerButton onClick={() => setShowSubscribe(true)}>
                      <span className="inline-flex items-center gap-2">
                        <IconFilePlus className="w-4 h-4" /> Generate Letters
                      </span>
                    </ShimmerButton>
                  </div>
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">Login to continue.</p>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <div className="text-sm font-medium mb-2">Timeline</div>
                  <ol className="relative border-s border-slate-200 dark:border-slate-700 ml-3">
                    {[
                      'Request received',
                      'Attorney reviewing the letter',
                      'Attorney approval',
                      'Your letter is drafted and posted to your MY LETTERS area',
                    ].map((step, i) => (
                      <li key={i} className="mb-6 ms-4">
                        <div className="absolute w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full -start-1.5 mt-1.5"></div>
                        <time className="mb-1 text-xs font-normal leading-none text-gray-400">Step {i + 1}</time>
                        <div className="text-sm">{step}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why teams choose us</CardTitle>
              <CardDescription>Fast, consistent, and attorney-aligned letters.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconUsers className="w-4 h-4" /> Feature {i}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Beautiful animation-ready section for your landing experience.</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SubscriptionModal open={showSubscribe} onClose={() => setShowSubscribe(false)} onSubscribe={() => setShowSubscribe(false)} />
    </div>
  );
};
