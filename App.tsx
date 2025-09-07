
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Particles } from './components/magicui/particles';
import { SparklesText } from './components/magicui/sparkles-text';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Spinner } from './components/Spinner';

// Import the new role-specific dashboards
import { UserDashboard } from './components/Dashboard';
import { EmployeeDashboard } from './components/ProjectRoadmap';
import { AdminDashboard } from './components/DatabasePlan';
import { ResetPasswordPage } from './components/ResetPasswordPage';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);

    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    if (token) {
        setResetToken(token);
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);


  if (isLoading) {
    return <Spinner />;
  }

  if (resetToken) {
      return <ResetPasswordPage token={resetToken} onResetSuccess={() => {
          setResetToken(null);
          // remove token from url
          window.history.replaceState({}, document.title, window.location.pathname);
      }} />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      case 'user':
      default:
        return <UserDashboard />;
    }
  };
  
  const getTitle = () => {
    switch(user.role) {
      case 'admin': return 'Admin Panel';
      case 'employee': return 'Affiliate Dashboard';
      case 'user':
      default: return 'Your Legal Dashboard';
    }
  };

  const getDescription = () => {
      switch(user.role) {
      case 'admin': return 'Manage users, letters, and system settings.';
      case 'employee': return 'Track your referrals and earnings.';
      case 'user':
      default: return 'Generate, manage, and track your legal letters with AI.';
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans">
      <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-b-2xl border-b border-slate-200/50 dark:border-slate-800 bg-white dark:bg-gray-950">
          <Header />
          <div className="text-center absolute bottom-12 z-10">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-5xl">
              <SparklesText>{getTitle()}</SparklesText>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{getDescription()}</p>
          </div>
          <Particles
            className="absolute inset-0 z-0"
            quantity={100}
            ease={80}
            color={isDarkMode ? "#ffffff" : "#000000"}
            refresh
          />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;
