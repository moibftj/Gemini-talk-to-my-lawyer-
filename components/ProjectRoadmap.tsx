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

const StatCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode; delay: number; }> = ({ title, value, description, icon, delay }) => (
     <BlurFade delay={delay} inView>
        <Card className="bg-white/80 dark:bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </CardContent>
        </Card>
    </BlurFade>
)

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
        <NeonGradientCard 
            className="w-full" 
            borderRadius={12}
            neonColors={{ firstColor: "#10B981", secondColor: "#2DD4BF" }} // Green/Teal Gradient
        >
            <Card className="bg-white/95 dark:bg-slate-900/95">
                <CardHeader>
                    <CardTitle>Affiliate Dashboard</CardTitle>
                    <CardDescription>Track your referral performance and earnings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <BlurFade delay={0.25} inView>
                        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Unique Affiliate Code</h3>
                            <p className="text-2xl font-bold tracking-widest text-center py-2">{stats.code}</p>
                        </div>
                    </BlurFade>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                        <StatCard 
                            title="Total Referrals"
                            value={stats.totalSignups}
                            description="new users signed up"
                            icon={<IconUsers className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                            delay={0.35}
                        />
                        <StatCard 
                            title="Total Earnings"
                            value={`$${stats.totalEarnings.toFixed(2)}`}
                            description="from 5% commission"
                            icon={<IconDollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                            delay={0.45}
                        />
                         <StatCard 
                            title="Accumulated Points"
                            value={stats.totalPoints}
                            description="from discount code usage"
                            icon={<IconStar className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                            delay={0.55}
                        />
                    </div>
                </CardContent>
            </Card>
        </NeonGradientCard>
    );
};