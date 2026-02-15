import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export type KpiItem = {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
};

type KpiGridProps = {
    items: KpiItem[];
};

export function KpiGrid({ items }: KpiGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((kpi) => (
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
    );
}
