import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export type KpiItem = {
    title: string;
    value: string;
    score: number;
    change: string;
    trend: 'up' | 'down';
};

type KpiGridProps = {
    items: KpiItem[];
};

export function KpiGrid({ items }: KpiGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((kpi) => {
                const size = 56;
                const stroke = 6;
                const radius = (size - stroke) / 2;
                const circumference = 2 * Math.PI * radius;
                const progress = Math.max(0, Math.min(100, kpi.score)) / 100;
                const dashOffset = circumference * (1 - progress);
                const gradientId = `donut-${kpi.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')}`;

                return (
                <div
                    key={kpi.title}
                    className="rounded-2xl border border-border/50 bg-card/70 px-4 py-4 shadow-sm backdrop-blur"
                >
                    <div className="flex items-center gap-4">
                        <svg
                            width={size}
                            height={size}
                            viewBox={`0 0 ${size} ${size}`}
                        >
                            <defs>
                                <linearGradient
                                    id={gradientId}
                                    x1="0"
                                    x2="1"
                                    y1="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-chart-2)"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--color-chart-1)"
                                    />
                                </linearGradient>
                            </defs>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="var(--color-border)"
                                strokeOpacity="0.4"
                                strokeWidth={stroke}
                                fill="none"
                            />
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={`url(#${gradientId})`}
                                strokeWidth={stroke}
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={`${circumference} ${circumference}`}
                                strokeDashoffset={dashOffset}
                                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                                style={{
                                    transition:
                                        'stroke-dashoffset 600ms ease',
                                }}
                            />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="text-[11px] font-semibold fill-foreground"
                            >
                                {kpi.value}
                            </text>
                        </svg>

                        <div className="flex-1 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">
                                {kpi.title}
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
                </div>
                );
            })}
        </div>
    );
}
