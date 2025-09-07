import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAffiliateData } from '../lib/affiliate';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { NeonGradientCard } from './magicui/neon-gradient-card';
import { BlurFade } from './magicui/blur-fade';
import { IconDollarSign, IconUsers, IconStar } from '../constants';

interface AffiliateStats {
    code: string;
    totalSignups: number;
    totalEarnings: number;
    totalPoints: number;
}

export const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<AffiliateStats | null>(null);

    useEffect(() => {
        if (user && user.role === 'employee') {
            const data = getAffiliateData(user.email);
            setStats(data);
        }
    }, [user]);

    if (!stats) {
        return (
            <div className="flex justify-center items-center p-8">
                <p>Loading affiliate data...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlurFade delay={0.25} inView>
                <NeonGradientCard className="w-full" borderRadius={12}>
                    <Card className="bg-white/95 dark:bg-slate-900/95">
                        <CardHeader>
                            <CardTitle>Your Affiliate Code</CardTitle>
                            <CardDescription>Share this code with new users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold tracking-widest bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">{stats.code}</p>
                        </CardContent>
                    </Card>
                </NeonGradientCard>
            </BlurFade>
            
            <BlurFade delay={0.35} inView>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        <IconUsers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.totalSignups}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">new users signed up</p>
                    </CardContent>
                </Card>
            </BlurFade>

            <BlurFade delay={0.45} inView>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <IconDollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">from 5% commission</p>
                    </CardContent>
                </Card>
            </BlurFade>

            <BlurFade delay={0.55} inView>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Accumulated Points</CardTitle>
                        <IconStar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.totalPoints}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">from discount code usage</p>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
};