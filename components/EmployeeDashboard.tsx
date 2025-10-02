
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { BlurFade } from './magicui/blur-fade';
import { apiClient } from '../services/apiClient';
import { IconTicket, IconUsers, IconDollarSign } from '../contexts/constants';
import { ShimmerButton } from './magicui/shimmer-button';

interface AffiliateStats {
    affiliateCode: string | null;
    usageCount: number;
    totalRevenue: number;
}

const StatCard = ({ icon, title, value, description, isCurrency = false }: { icon: React.ReactNode, title: string, value: string | number, description: string, isCurrency?: boolean }) => {
    const formatValue = () => {
        if (isCurrency && typeof value === 'number') {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
        return value;
    }

    return (
        <Card className="bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-slate-500 dark:text-slate-400">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatValue()}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
            </CardContent>
        </Card>
    );
};

const DashboardSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/4"></div>
                    <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export const EmployeeDashboard: React.FC = () => {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedStats = await apiClient.fetchAffiliateStats();
                setStats(fetchedStats);
            } catch (err: any) {
                console.error("Failed to fetch affiliate stats:", err);
                setError("Could not load your affiliate data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleCopyToClipboard = () => {
        if (stats?.affiliateCode) {
            navigator.clipboard.writeText(stats.affiliateCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }
    
    if (!stats) {
        return null;
    }

    const hasAffiliateCode = stats.affiliateCode && stats.affiliateCode !== 'N/A';

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <BlurFade delay={0.25} inView>
                <Card className="bg-white/95 dark:bg-slate-900/95 flex flex-col justify-between">
                    <div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Your Affiliate Code</CardTitle>
                            <IconTicket className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-wider">{stats.affiliateCode || 'N/A'}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {hasAffiliateCode ? 'Share this code to earn commissions.' : 'Contact admin for your code.'}
                            </p>
                        </CardContent>
                    </div>
                    {hasAffiliateCode && (
                        <CardFooter className="pt-0">
                            <ShimmerButton onClick={handleCopyToClipboard} className="w-full text-sm h-9">
                                {copied ? 'Copied!' : 'Copy Code'}
                            </ShimmerButton>
                        </CardFooter>
                    )}
                </Card>
            </BlurFade>
            <BlurFade delay={0.35} inView>
                <StatCard
                    title="Code Usage"
                    value={stats.usageCount}
                    description="Total subscriptions using your code."
                    icon={<IconUsers className="w-5 h-5" />}
                />
            </BlurFade>
            <BlurFade delay={0.45} inView>
                <StatCard
                    title="Total Earnings"
                    value={stats.totalRevenue}
                    description="Your 5% commission on all sales."
                    icon={<IconDollarSign className="w-5 h-5" />}
                    isCurrency
                />
            </BlurFade>
        </div>
    );
};