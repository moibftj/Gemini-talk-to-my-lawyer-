import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LetterRequestForm } from './components/LetterRequestForm';
import { RetroGrid } from './components/magicui/retro-grid';
import { MOCK_LETTERS } from './constants';
import type { LetterRequest } from './types';

type View = 'dashboard' | 'new_letter_form';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [letters, setLetters] = useState<LetterRequest[]>(MOCK_LETTERS);

  const navigateTo = (view: View) => setCurrentView(view);

  const handleNewLetter = (newLetterData: Omit<LetterRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const letter: LetterRequest = {
      ...newLetterData,
      id: `letter-${Date.now()}`, // Use a more unique ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLetters(prevLetters => [letter, ...prevLetters]);
    navigateTo('dashboard');
  };

  let content;
  switch (currentView) {
    case 'new_letter_form':
      content = <LetterRequestForm onFormSubmit={handleNewLetter} onCancel={() => navigateTo('dashboard')} />;
      break;
    case 'dashboard':
    default:
      content = <Dashboard letters={letters} onNewLetterClick={() => navigateTo('new_letter_form')} />;
      break;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans">
      <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-b-2xl border-b border-slate-200/50 dark:border-slate-800 bg-white dark:bg-gray-950">
          <Header />
          <div className="text-center absolute bottom-12 z-10">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-5xl">Your Legal Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Generate, manage, and track your legal letters with AI.</p>
          </div>
          <RetroGrid />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20">
        {content}
      </main>
    </div>
  );
};

export default App;
