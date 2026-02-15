import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { LineAreaChart, type LineAreaChartData } from '@/components/charts/line-area-chart';
import { KpiGrid, type KpiItem } from '@/components/dashboard/kpi-grid';

type GrowthCardProps = {
    data: LineAreaChartData;
    metrics?: KpiItem[];
};

export function GrowthCard({ data, metrics = [] }: GrowthCardProps) {
    const seriesValues = useMemo(() => {
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return [];
            }

            if (typeof data[0] === 'number') {
                return data as number[];
            }

            const points = [...(data as { x: string; y: number }[])];
            points.sort((a, b) => {
                const timeA = new Date(a.x).getTime();
                const timeB = new Date(b.x).getTime();
                if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
                    return a.x.localeCompare(b.x);
                }
                return timeA - timeB;
            });
            return points.map((point) => point.y);
        }

        const entries = Object.entries(data);
        entries.sort(([dateA], [dateB]) => {
            const timeA = new Date(dateA).getTime();
            const timeB = new Date(dateB).getTime();
            if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
                return dateA.localeCompare(dateB);
            }
            return timeA - timeB;
        });
        return entries.map(([, value]) => value);
    }, [data]);

    const numericValues = seriesValues
        .map((value) => (typeof value === 'number' ? value : Number.NaN))
        .filter((value) => !Number.isNaN(value));
    const first = numericValues[0];
    const last = numericValues[numericValues.length - 1];
    const momentum =
        typeof first === 'number' && typeof last === 'number' && first > 0
            ? ((last - first) / first) * 100
            : 0;
    const momentumText = `${momentum >= 0 ? '+' : ''}${Math.round(momentum)}% momentum`;
    const isPositive = momentum >= 0;

    return (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Growth
                    </p>
                </div>
                <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        isPositive
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-rose-500/10 text-rose-500'
                    }`}
                >
                    {isPositive ? (
                        <ArrowUpRight className="size-3.5" />
                    ) : (
                        <ArrowDownRight className="size-3.5" />
                    )}
                    {momentumText}
                </div>
            </div>

            <div className="mt-5">
                <LineAreaChart
                    data={data}
                    className="h-full"
                    smoothWindow={5}
                    labelCount={3}
                />
            </div>

            {metrics.length > 0 && (
                <div className="mt-5">
                    <KpiGrid items={metrics} />
                </div>
            )}
        </div>
    );
}
