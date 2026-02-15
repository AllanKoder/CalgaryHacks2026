import { ArrowUpRight } from 'lucide-react';
import { LineAreaChart } from '@/components/charts/line-area-chart';

type GrowthCardProps = {
    data: Record<string, number> | number[];
    stats: { label: string; value: string }[];
};

export function GrowthCard({ data, stats }: GrowthCardProps) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        Growth
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Decision quality trend over recent weeks.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight className="size-3.5" />
                    +31% momentum
                </div>
            </div>

            <div className="mt-5">
                <LineAreaChart data={data} className="h-full" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
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
    );
}
