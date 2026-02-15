import { Head } from '@inertiajs/react';
import {
    CommunityPreviewCard,
    type CommunityItem,
} from '@/components/dashboard/community-preview-card';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { GrowthCard } from '@/components/dashboard/growth-card';
import { KpiGrid, type KpiItem } from '@/components/dashboard/kpi-grid';
import { RigourCard } from '@/components/dashboard/rigour-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/route-helpers';
import type { BreadcrumbItem } from '@/types';

type DashboardPageProps = {
    userData?: {
        emotionalMastery: number;
        cognitiveClarity: number;
        socialRelational: number;
        ethicalMoral: number;
        physicalLifestyle: number;
        identityGrowth: number;
    } | null;
    lineChartHistory?: {
        timestamp: string;
        overall_score: number;
        delta: number;
    }[] | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const fallbackGrowthData = {
    '2025-12-01': 52,
    '2025-12-08': 58,
    '2025-12-15': 61,
    '2025-12-22': 63,
    '2025-12-29': 70,
    '2026-01-05': 76,
    '2026-01-12': 84,
};

const growthStats = [
    { label: 'Emotional Mastery', value: '63%' },
    { label: 'Cognitive Clarity', value: '58%' },
    { label: 'Social & Relational', value: '71%' },
];

const fallbackRadarMetrics = [
    { label: 'Emotional Mastery', value: 63 },
    { label: 'Cognitive Clarity', value: 58 },
    { label: 'Social & Relational', value: 71 },
    { label: 'Ethical & Moral', value: 67 },
    { label: 'Physical & Lifestyle', value: 54 },
    { label: 'Identity & Growth', value: 60 },
];

const kpis: KpiItem[] = [
    {
        title: 'Emotional Mastery',
        value: '63%',
        change: '+5%',
        trend: 'up',
    },
    {
        title: 'Cognitive Clarity',
        value: '58%',
        change: '+2%',
        trend: 'up',
    },
    {
        title: 'Social & Relational',
        value: '71%',
        change: '+6%',
        trend: 'up',
    },
    {
        title: 'Ethical & Moral',
        value: '67%',
        change: '+3%',
        trend: 'up',
    },
    {
        title: 'Physical & Lifestyle',
        value: '54%',
        change: '-2%',
        trend: 'down',
    },
    {
        title: 'Identity & Growth',
        value: '60%',
        change: '+4%',
        trend: 'up',
    },
];

const communityItems: CommunityItem[] = [
    {
        title: 'Did I fall for cherry-picked stats about recovery?',
        author: 'MattL',
        time: '8h ago',
        tag: 'Cognitive Bias',
        replies: 14,
    },
    {
        title: 'Help me decide: grad school vs. full-time work',
        author: 'DataJunkie',
        time: '2d ago',
        tag: 'Decision Lab',
        replies: 22,
    },
    {
        title: 'Evaluating climate projections with uncertainty',
        author: 'Kira',
        time: '4d ago',
        tag: 'Evidence Review',
        replies: 9,
    },
];

export default function Dashboard({
    userData,
    lineChartHistory,
}: DashboardPageProps) {
    const radarMetrics = userData
        ? [
              { label: 'Emotional Mastery', value: userData.emotionalMastery },
              { label: 'Cognitive Clarity', value: userData.cognitiveClarity },
              { label: 'Social & Relational', value: userData.socialRelational },
              { label: 'Ethical & Moral', value: userData.ethicalMoral },
              { label: 'Physical & Lifestyle', value: userData.physicalLifestyle },
              { label: 'Identity & Growth', value: userData.identityGrowth },
          ]
        : fallbackRadarMetrics;

    const growthData =
        lineChartHistory && lineChartHistory.length > 0
            ? Object.fromEntries(
                  lineChartHistory.map((point) => [
                      point.timestamp,
                      point.overall_score,
                  ]),
              )
            : fallbackGrowthData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.14),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(14,116,144,0.14),_transparent_40%)]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
                    <DashboardHero name="Andrew" />

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="flex flex-col gap-6">
                            <GrowthCard data={growthData} stats={growthStats} />
                            <KpiGrid items={kpis} />
                        </div>

                        <div className="flex flex-col gap-6">
                            <RigourCard metrics={radarMetrics} />
                            <CommunityPreviewCard items={communityItems} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
