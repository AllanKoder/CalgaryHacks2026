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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const growthData = {
    '2025-12-01': 52,
    '2025-12-08': 58,
    '2025-12-15': 61,
    '2025-12-22': 63,
    '2025-12-29': 70,
    '2026-01-05': 76,
    '2026-01-12': 84,
};

const growthStats = [
    { label: 'Week 7', value: '49%' },
    { label: 'Confidence', value: '63%' },
    { label: 'Focus', value: '86%' },
];

const radarMetrics = [
    { label: 'Rigour', value: 68 },
    { label: 'Evidence', value: 66 },
    { label: 'Counter', value: 61 },
    { label: 'Assumptions', value: 57 },
    { label: 'Bias', value: 53 },
    { label: 'Sources', value: 64 },
];

const kpis: KpiItem[] = [
    {
        title: 'Average Confidence',
        value: '63%',
        change: '+7%',
        trend: 'up',
    },
    {
        title: 'Bias Rate',
        value: '27%',
        change: '-4%',
        trend: 'down',
    },
    {
        title: 'Calibration Score',
        value: '49%',
        change: '+3%',
        trend: 'up',
    },
    {
        title: 'Blindspots',
        value: '29%',
        change: '-2%',
        trend: 'down',
    },
    {
        title: 'Decision Quality',
        value: '+2',
        change: '+1',
        trend: 'up',
    },
    {
        title: 'Revision Rate',
        value: '8/10',
        change: '+1',
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

export default function Dashboard() {
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
