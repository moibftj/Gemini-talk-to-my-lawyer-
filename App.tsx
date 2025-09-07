
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Spotlight } from './components/magicui/spotlight';
import { SparklesText } from './components/magicui/sparkles-text';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Spinner } from './components/Spinner';

// Import the new role-specific dashboards
import { UserDashboard } from './components/Dashboard';
import { EmployeeDashboard } from './components/ProjectRoadmap';
import { AdminDashboard } from './components/DatabasePlan';
import { ResetPasswordPage } from './components/ResetPasswordPage';

type UserDashboardView = 'dashboard' | 'new_letter_form';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [userDashboardView, setUserDashboardView] = useState<UserDashboardView>('dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    if (token) {
        setResetToken(token);
    }
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
        return <UserDashboard currentView={userDashboardView} setCurrentView={setUserDashboardView} />;
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
      <Spotlight className="relative flex h-96 w-full flex-col items-center justify-center overflow-hidden rounded-b-2xl border-b border-slate-800 bg-gradient-to-br from-gray-950 to-slate-900">
          <Header 
            userDashboardView={user.role === 'user' ? userDashboardView : undefined}
            setUserDashboardView={user.role === 'user' ? setUserDashboardView : undefined}
          />
          <div className="text-center absolute bottom-12 z-10 p-4">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-100 sm:text-5xl">
              <SparklesText>{getTitle()}</SparklesText>
            </h1>
            <p className="mt-4 text-lg text-gray-400">{getDescription()}</p>
          </div>
      </Spotlight>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;