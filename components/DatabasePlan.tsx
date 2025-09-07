import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { MOCK_LETTERS } from '../constants';
import { USERS_STORAGE_KEY } from '../lib/auth';
import type { LetterRequest, UserRole } from '../types';
import { NeonGradientCard } from './magicui/neon-gradient-card';
import { BlurFade } from './magicui/blur-fade';

interface StoredUser {
    hash: string;
    role: UserRole;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<Record<string, StoredUser>>({});
  const [letters] = useState<LetterRequest[]>(MOCK_LETTERS); // Using mock letters for now

  useEffect(() => {
    try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
        setUsers(storedUsers);
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
    }
  }, []);

  const adminGradient = { firstColor: "#8B5CF6", secondColor: "#6366F1" }; // Purple/Indigo

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <BlurFade delay={0.25} inView>
        <NeonGradientCard className="w-full" borderRadius={12} neonColors={adminGradient}>
            <Card className="bg-white/95 dark:bg-slate-900/95">
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>List of all users in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(users).map(([email, userData]) => (
                        <tr key={email} className="bg-transparent border-b dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium whitespace-nowrap">{email}</td>
                          <td className="px-6 py-4 capitalize">{userData.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        </NeonGradientCard>
      </BlurFade>

      <BlurFade delay={0.35} inView>
        <NeonGradientCard className="w-full" borderRadius={12} neonColors={adminGradient}>
            <Card className="bg-white/95 dark:bg-slate-900/95">
              <CardHeader>
                <CardTitle>All Letter Requests</CardTitle>
                <CardDescription>A complete log of all letter requests.</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">User ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {letters.map((letter) => (
                        <tr key={letter.id} className="bg-transparent border-b dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium whitespace-nowrap">{letter.title}</td>
                          <td className="px-6 py-4 capitalize">{letter.status}</td>
                          <td className="px-6 py-4">{letter.userId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        </NeonGradientCard>
      </BlurFade>
    </div>
  );
};