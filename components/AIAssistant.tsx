
import React from 'react';
import { Card } from './Card';

interface AIAssistantProps {
  onAnalyze: () => void;
  analysis: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
    <span className="text-sm text-slate-500 dark:text-slate-400">AI is thinking...</span>
  </div>
);

const FormattedAnalysis: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return (
    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="font-semibold text-base !mt-4 !mb-1">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="font-bold text-lg !mt-5 !mb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
           return <p key={index} className="font-bold">{line.substring(2, line.length - 2)}</p>
        }
        if (line.match(/^\d+\.\s/)) {
            return <p key={index} className="!my-1">{line}</p>
        }
        return <p key={index} className="!my-1">{line}</p>;
      })}
    </div>
  );
};


export const AIAssistant: React.FC<AIAssistantProps> = ({ onAnalyze, analysis, isLoading, error }) => {
  return (
    <Card title="AI Project Assistant">
      <div className="p-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
            Get an instant summary, risk assessment, and strategic recommendations for this project.
          </p>
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="w-full sm:w-auto flex-shrink-0 px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-md shadow-sm hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Analyzing...' : 'Generate AI Analysis'}
          </button>
        </div>

        {(isLoading || error || analysis) && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {analysis && !isLoading && <FormattedAnalysis text={analysis} />}
          </div>
        )}
      </div>
    </Card>
  );
};
