import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarCheck,
    MessageCircle,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineAreaChart } from '@/components/charts/line-area-chart';
import { RadarChart } from '@/components/charts/radar-chart';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/route-helpers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const growthData = [52, 58, 61, 63, 70, 76, 84];
const growthLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

const radarMetrics = [
    { label: 'Rigour', value: 68 },
    { label: 'Evidence', value: 66 },
    { label: 'Counter', value: 61 },
    { label: 'Assumptions', value: 57 },
    { label: 'Bias', value: 53 },
    { label: 'Sources', value: 64 },
];

const kpis = [
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

const communityItems = [
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

const rigourScore = Math.round(
    radarMetrics.reduce((sum, metric) => sum + metric.value, 0) /
        radarMetrics.length,
);

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(59,130,246,0.15),_transparent_40%)]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                                <Sparkles className="size-3.5 text-primary" />
                                Insight workspace
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                    Sharpen your thinking.
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                                    Welcome back, Andrew. Here is your critical thinking dashboard.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button variant="outline" className="bg-white/70">
                                <CalendarCheck className="size-4" />
                                Review decisions
                            </Button>
                            <Button className="shadow-lg shadow-primary/20">
                                Analyze a new claim
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="flex flex-col gap-6">
                            <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Growth
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Decision quality over the last 7 weeks.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                                        <ArrowUpRight className="size-3.5" />
                                        +31% this month
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <LineAreaChart
                                        data={growthData}
                                        labels={growthLabels}
                                        className="h-full"
                                    />
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    {[
                                        { label: 'Week 7', value: '49%' },
                                        { label: 'Confidence', value: '63%' },
                                        { label: 'Focus', value: '86%' },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-xl border border-border/60 bg-background/70 px-4 py-3"
                                        >
                                            <p className="text-xs text-muted-foreground">
                                                {item.label}
                                            </p>
                                            <p className="text-lg font-semibold text-foreground">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {kpis.map((kpi) => (
                                    <div
                                        key={kpi.title}
                                        className="rounded-2xl border border-border/60 bg-card/70 px-4 py-4 shadow-sm"
                                    >
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {kpi.title}
                                        </p>
                                        <div className="mt-3 flex items-end justify-between">
                                            <p className="text-2xl font-semibold text-foreground">
                                                {kpi.value}
                                            </p>
                                            <span
                                                className={`flex items-center gap-1 text-xs font-semibold ${
                                                    kpi.trend === 'up'
                                                        ? 'text-emerald-600'
                                                        : 'text-rose-500'
                                                }`}
                                            >
                                                {kpi.trend === 'up' ? (
                                                    <ArrowUpRight className="size-3.5" />
                                                ) : (
                                                    <ArrowDownRight className="size-3.5" />
                                                )}
                                                {kpi.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Rigour Score
                                        </p>
                                        <div className="mt-2 flex items-end gap-2">
                                            <span className="text-3xl font-semibold text-foreground">
                                                {rigourScore}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                / 100
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Strong on evidence, keep sharpening bias checks.
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full px-3 py-1 text-[11px]"
                                    >
                                        Updated today
                                    </Badge>
                                </div>

                                <div className="mt-5">
                                    <RadarChart metrics={radarMetrics} />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Community Preview
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Fresh discussions from your network.
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        See all
                                    </Button>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {communityItems.map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-xl border border-border/60 bg-background/70 px-4 py-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {item.title}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                        <span>
                                                            {item.author} · {item.time}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px]"
                                                        >
                                                            {item.tag}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                                    <MessageCircle className="size-3.5" />
                                                    {item.replies}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
