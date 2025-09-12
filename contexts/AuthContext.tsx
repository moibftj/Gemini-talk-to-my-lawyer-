import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import supabase from '../services/supabase';
import type { User, UserRole } from '../types';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole, affiliateCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  authEvent: AuthChangeEvent | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authEvent, setAuthEvent] = useState<AuthChangeEvent | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleAuthSession(session);
      }
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthEvent(event);
        if (event === 'SIGNED_IN' && session) {
          await handleAuthSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'PASSWORD_RECOVERY') {
          // This event is handled in App.tsx to show the password reset page
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSession = async (session: Session) => {
    if (session.user) {
      const profile = await fetchUserProfile(session.user);
      setUser({
        email: session.user.email!,
        role: profile?.role || 'user',
      });
    }
  };

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', supabaseUser.id)
      .single();
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data as { role: UserRole };
  };

  const parseSupabaseError = (error: any): string => {
    let errorMessage = error.message;
    
    // Parse Supabase error messages that contain nested JSON
    if (errorMessage && errorMessage.startsWith('Supabase request failed')) {
      try {
        // Extract JSON from the error message
        const jsonMatch = errorMessage.match(/\{.*\}$/);
        if (jsonMatch) {
          const errorData = JSON.parse(jsonMatch[0]);
          if (errorData.body) {
            const bodyData = JSON.parse(errorData.body);
            if (bodyData.message) {
              errorMessage = bodyData.message;
            }
          }
        }
      } catch (parseError) {
        // If parsing fails, use the original message
        console.error('Failed to parse error message:', parseError);
      }
    }
    
    // Convert common error messages to user-friendly versions
    if (errorMessage === 'Invalid login credentials') {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (errorMessage.includes('User already registered')) {
      return 'An account with this email already exists. Please try signing in.';
    }
    if (errorMessage.includes('Password should be at least 6 characters')) {
      return 'Password must be at least 6 characters long.';
    }
    if (errorMessage.includes('Email rate limit exceeded') || errorMessage.includes('you can only request this after')) {
      return errorMessage; // Keep rate limit messages as-is since they're already user-friendly
    }
    
    return errorMessage;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw new Error(parseSupabaseError(error));
    }
  };

  const signup = async (email: string, password: string, role: UserRole, affiliateCode?: string) => {
    // The database is configured with a trigger that automatically creates a
    // 'profiles' row for each new user in the 'auth.users' table.
    // We pass the role in the metadata so the trigger can access it.
    const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                role: role,
                affiliate_code: affiliateCode
            }
        }
    });
    if (error) {
        throw new Error(parseSupabaseError(error));
    }
    // The user will be signed in after confirming their email.
    // The onAuthStateChange listener will handle the session and profile fetching.
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Supabase handles the token in the URL
    });
    if (error) {
        throw new Error(parseSupabaseError(error));
    }
  };

  const updateUserPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
        throw new Error(parseSupabaseError(error));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, requestPasswordReset, updateUserPassword, authEvent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};