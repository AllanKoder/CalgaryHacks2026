import { Head } from '@inertiajs/react';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { GrowthCard } from '@/components/dashboard/growth-card';
import type { KpiItem } from '@/components/dashboard/kpi-grid';
import { QuickReviewCard } from '@/components/dashboard/quick-review-card';
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
    metricDeltas?: Record<string, number>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const fallbackGrowthData = [
    { x: '2025-12-01', y: 52 },
    { x: '2025-12-08', y: 58 },
    { x: '2025-12-15', y: 61 },
    { x: '2025-12-22', y: 63 },
    { x: '2025-12-29', y: 70 },
    { x: '2026-01-05', y: 76 },
    { x: '2026-01-12', y: 84 },
];

const fallbackRadarMetrics = [
    { label: 'Emotional Mastery', value: 63 },
    { label: 'Cognitive Clarity', value: 58 },
    { label: 'Social & Relational', value: 71 },
    { label: 'Ethical & Moral', value: 67 },
    { label: 'Physical & Lifestyle', value: 54 },
    { label: 'Identity & Growth', value: 60 },
];

const fallbackKpis: KpiItem[] = [
    {
        title: 'Emotional Mastery',
        value: '63',
        score: 63,
        change: '+13',
        trend: 'up',
    },
    {
        title: 'Cognitive Clarity',
        value: '58',
        score: 58,
        change: '+8',
        trend: 'up',
    },
    {
        title: 'Social & Relational',
        value: '71',
        score: 71,
        change: '+21',
        trend: 'up',
    },
    {
        title: 'Ethical & Moral',
        value: '67',
        score: 67,
        change: '+17',
        trend: 'up',
    },
    {
        title: 'Physical & Lifestyle',
        value: '54',
        score: 54,
        change: '+4',
        trend: 'up',
    },
    {
        title: 'Identity & Growth',
        value: '60',
        score: 60,
        change: '+10',
        trend: 'up',
    },
];


export default function Dashboard({
    userData,
    lineChartHistory,
    metricDeltas = {},
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
            ? lineChartHistory.map((point) => ({
                  x: point.timestamp,
                  y: point.overall_score,
              }))
            : fallbackGrowthData;

    const buildKpis = (
        scores: Record<string, number>,
        deltas: Record<string, number>,
    ): KpiItem[] => {
        const items = [
            { title: 'Emotional Mastery', key: 'emotionalMastery' },
            { title: 'Cognitive Clarity', key: 'cognitiveClarity' },
            { title: 'Social & Relational', key: 'socialRelational' },
            { title: 'Ethical & Moral', key: 'ethicalMoral' },
            { title: 'Physical & Lifestyle', key: 'physicalLifestyle' },
            { title: 'Identity & Growth', key: 'identityGrowth' },
        ];

        return items.map((item) => {
            const rawScore = scores[item.key] ?? 0;
            const score = Math.round(rawScore);
            const changeValue = deltas[item.key] ?? 0;
            const roundedChange = Math.round(changeValue);
            return {
                title: item.title,
                value: `${score}`,
                score,
                change: `${roundedChange >= 0 ? '+' : ''}${roundedChange}`,
                trend: roundedChange >= 0 ? 'up' : 'down',
            };
        });
    };

    const kpis = userData
        ? buildKpis(userData, metricDeltas)
        : fallbackKpis;

    const sortedMetrics = [...radarMetrics].sort(
        (a, b) => b.value - a.value,
    );
    const topMetric = sortedMetrics[0];
    const secondMetric = sortedMetrics[1];

    const quickReview = {
        metric: topMetric.label,
        subtitle: 'Your strongest signal right now. Keep reinforcing the habits behind it.',
        dialogTitle: `Quick Review: ${topMetric.label}`,
        review:
            'You are consistently scoring higher in this domain compared to the rest of your profile. The last stretch of updates shows steady improvement with fewer regressions. Keep the same routine that produced these gains and look for one small experiment this week to maintain momentum.',
    };

    const secondaryReview = secondMetric
        ? {
              metric: secondMetric.label,
              subtitle: 'A close second. Focus here to round out your profile.',
              dialogTitle: `Quick Review: ${secondMetric.label}`,
              review:
                  'This area is trending upward but still has a few dips. Pick one consistent micro-habit and track it for a week to stabilize gains and avoid regression.',
          }
        : undefined;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-[calc(100svh-4rem)] bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.14),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(14,116,144,0.14),_transparent_40%)] lg:h-[calc(100svh-4rem)] lg:overflow-hidden">
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4 px-4 py-4">
                    <DashboardHero name="Andrew" />

                    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
                        <div className="flex min-h-0 flex-col gap-4">
                            <GrowthCard
                                data={growthData}
                                metrics={kpis}
                                className="h-full"
                            />
                        </div>

                        <div className="flex min-h-0 flex-col gap-4">
                            <RigourCard metrics={radarMetrics} className="h-full" />
                            <QuickReviewCard
                                data={quickReview}
                                secondary={secondaryReview}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
