import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { STATUS_STYLES, IconFilePlus, IconEdit } from '../constants';
import { ShimmerButton } from './magicui/shimmer-button';
import { NeonGradientCard } from './magicui/neon-gradient-card';
import { BlurFade } from './magicui/blur-fade';
import { LetterRequestForm } from './LetterRequestForm';
import { MOCK_LETTERS } from '../constants';
import type { LetterRequest } from '../types';

type View = 'dashboard' | 'new_letter_form';

const LetterRow: React.FC<{ letter: LetterRequest; onEdit: (letter: LetterRequest) => void }> = ({ letter, onEdit }) => {
  const style = STATUS_STYLES[letter.status];
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-150">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white truncate">{letter.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {letter.letterType.split('_').join(' ')}
        </p>
      </div>
      <div className="flex items-center space-x-4 ml-4">
         <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text} capitalize`}>
            {letter.status.replace('_', ' ')}
        </span>
        <time className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
            Updated {new Date(letter.updatedAt).toLocaleDateString()}
        </time>
        <button onClick={() => onEdit(letter)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-1 rounded-full transition-colors">
            <IconEdit className="h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>
      </div>
    </div>
  );
};

const LetterList: React.FC<{ letters: LetterRequest[], onNewLetterClick: () => void, onEditLetterClick: (letter: LetterRequest) => void }> = ({ letters, onNewLetterClick, onEditLetterClick }) => {
  return (
    <NeonGradientCard className="w-full" borderRadius={12}>
        <Card className="bg-white/95 dark:bg-slate-900/95">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Letter Requests</CardTitle>
              <CardDescription>View and manage all your generated letters.</CardDescription>
            </div>
            <ShimmerButton onClick={onNewLetterClick} className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white flex items-center gap-2">
                    <IconFilePlus className="h-4 w-4" />
                    New Letter
                </span>
            </ShimmerButton>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-800">
                {letters.length > 0 ? (
                    letters.map((letter, idx) => (
                        <BlurFade key={letter.id} delay={0.25 + idx * 0.05} inView>
                            <LetterRow letter={letter} onEdit={onEditLetterClick} />
                        </BlurFade>
                    ))
                ) : (
                    <BlurFade delay={0.25} inView>
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <p>You haven't created any letters yet.</p>
                            <p className="text-sm mt-1">Click "New Letter" to get started.</p>
                        </div>
                    </BlurFade>
                )}
            </div>
          </CardContent>
        </Card>
    </NeonGradientCard>
  );
};

export const UserDashboard: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [letters, setLetters] = useState<LetterRequest[]>(MOCK_LETTERS);
    const [editingLetter, setEditingLetter] = useState<LetterRequest | null>(null);
  
    const navigateTo = (view: View) => setCurrentView(view);
  
    const handleEditLetter = (letter: LetterRequest) => {
      setEditingLetter(letter);
      navigateTo('new_letter_form');
    };
  
    const handleCancelForm = () => {
      setEditingLetter(null);
      navigateTo('dashboard');
    };
  
    const handleSaveLetter = (letterData: Omit<LetterRequest, 'id' | 'createdAt' | 'updatedAt'> | LetterRequest) => {
      if ('id' in letterData && letterData.id) {
        // Update existing letter
        const updatedLetter = { ...letterData, updatedAt: new Date().toISOString() } as LetterRequest;
        setLetters(prevLetters => 
          prevLetters.map(l => (l.id === updatedLetter.id ? updatedLetter : l))
        );
      } else {
        // Create new letter
        const newLetter: LetterRequest = {
          ...letterData,
          id: `letter-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setLetters(prevLetters => [newLetter, ...prevLetters]);
      }
      setEditingLetter(null);
      navigateTo('dashboard');
    };

  if (currentView === 'new_letter_form') {
    return (
      <LetterRequestForm 
        onFormSubmit={handleSaveLetter} 
        onCancel={handleCancelForm}
        letterToEdit={editingLetter} 
      />
    );
  }
  
  return (
    <LetterList 
      letters={letters} 
      onNewLetterClick={() => navigateTo('new_letter_form')}
      onEditLetterClick={handleEditLetter}
    />
  );
};