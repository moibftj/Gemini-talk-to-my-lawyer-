import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { MOCK_LETTERS, STATUS_STYLES, IconFilePlus } from '../constants';
import type { LetterRequest } from '../types';

const LetterRow: React.FC<{ letter: LetterRequest }> = ({ letter }) => {
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
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<{ onNewLetterClick: () => void }> = ({ onNewLetterClick }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Letter Requests</CardTitle>
          <CardDescription>View and manage all your generated letters.</CardDescription>
        </div>
        <button 
          onClick={onNewLetterClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <IconFilePlus className="h-4 w-4" />
          New Letter
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-gray-200 dark:border-gray-800">
            {MOCK_LETTERS.map(letter => <LetterRow key={letter.id} letter={letter} />)}
        </div>
      </CardContent>
    </Card>
  );
};
