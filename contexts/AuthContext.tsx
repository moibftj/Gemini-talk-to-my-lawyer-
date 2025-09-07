import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { hashPassword, USERS_STORAGE_KEY, TOKEN_STORAGE_KEY, USER_EMAIL_KEY, USER_ROLE_KEY, PASSWORD_RESET_TOKEN_STORAGE_KEY } from '../lib/auth';
import { creditAffiliate, initializeMockAffiliates } from '../lib/affiliate';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole, affiliateCode?: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const email = localStorage.getItem(USER_EMAIL_KEY);
    const role = localStorage.getItem(USER_ROLE_KEY);
    if (token && email && role) {
      setUser({ email, role: role as UserRole });
    }

    // One-time setup for demo accounts
    const setupDone = localStorage.getItem('demo-setup-done');
    if (!setupDone) {
        const setup = async () => {
            const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
            if (!storedUsers['admin@example.com']) {
                storedUsers['admin@example.com'] = { hash: await hashPassword('admin123'), role: 'admin' };
            }
            if (!storedUsers['employee@example.com']) {
                storedUsers['employee@example.com'] = { hash: await hashPassword('employee123'), role: 'employee' };
            }
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
            initializeMockAffiliates();
            localStorage.setItem('demo-setup-done', 'true');
            console.log("Demo accounts (admin@example.com, employee@example.com) with passwords 'admin123' and 'employee123' created.");
        };
        setup();
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
    const userData = storedUsers[email.toLowerCase()];

    if (!userData) {
      throw new Error("User not found.");
    }

    const passwordHash = await hashPassword(password);

    if (passwordHash !== userData.hash) {
      throw new Error("Invalid password.");
    }
    
    const token = `dummy-token-${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_EMAIL_KEY, email);
    localStorage.setItem(USER_ROLE_KEY, userData.role);
    setUser({ email, role: userData.role });
  };

  const signup = async (email: string, password: string, role: UserRole, affiliateCode?: string) => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
    
    if (storedUsers[email.toLowerCase()]) {
      throw new Error("User with this email already exists.");
    }
    
    const passwordHash = await hashPassword(password);
    storedUsers[email.toLowerCase()] = { hash: passwordHash, role };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));

    if (affiliateCode) {
        creditAffiliate(affiliateCode, {
            userEmail: email,
            subscriptionAmount: 50, // Mocked subscription value
            usedDiscount: Math.random() > 0.5, // Mocked discount usage
        });
    }

    // Automatically log in after successful signup
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    setUser(null);
  };

  const requestPasswordReset = async (email: string) => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
    if (!storedUsers[email.toLowerCase()]) {
        // Don't throw an error to prevent user enumeration
        console.log(`Password reset requested for non-existent user: ${email}`);
        return;
    }

    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const expiry = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
    
    const resetTokens = JSON.parse(localStorage.getItem(PASSWORD_RESET_TOKEN_STORAGE_KEY) || '{}');
    resetTokens[resetToken] = { email, expiry };
    localStorage.setItem(PASSWORD_RESET_TOKEN_STORAGE_KEY, JSON.stringify(resetTokens));

    // --- Simulation of sending an email ---
    const resetUrl = `${window.location.origin}${window.location.pathname}?reset_token=${resetToken}`;
    console.log("--- PASSWORD RESET SIMULATION ---");
    console.log(`A password reset link for ${email} has been 'sent'.`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log("---------------------------------");
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const resetTokens = JSON.parse(localStorage.getItem(PASSWORD_RESET_TOKEN_STORAGE_KEY) || '{}');
    const tokenData = resetTokens[token];

    if (!tokenData || tokenData.expiry < Date.now()) {
        throw new Error("Invalid or expired password reset token.");
    }

    const { email } = tokenData;
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
    const userData = storedUsers[email.toLowerCase()];

    if (!userData) {
        throw new Error("User associated with token not found.");
    }

    const newPasswordHash = await hashPassword(newPassword);
    storedUsers[email.toLowerCase()].hash = newPasswordHash;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));

    // Clean up used token
    delete resetTokens[token];
    localStorage.setItem(PASSWORD_RESET_TOKEN_STORAGE_KEY, JSON.stringify(resetTokens));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, requestPasswordReset, resetPassword }}>
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