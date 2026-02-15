import { Badge } from '@/components/ui/badge';
import { RadarChart } from '@/components/charts/radar-chart';
import { cn } from '@/lib/utils';

type RigourMetric = {
    label: string;
    value: number;
};

type RigourCardProps = {
    metrics: RigourMetric[];
    status?: string;
    title?: string;
    className?: string;
};

export function RigourCard({
    metrics,
    status = 'Updated today',
    title = 'Insight Score',
    className,
}: RigourCardProps) {
    const score = Math.round(
        metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length,
    );

    return (
        <div
            className={cn(
                'flex h-full flex-col rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur',
                className,
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {title}
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                        <span className="text-3xl font-semibold text-foreground">
                            {score}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            / 100
                        </span>
                    </div>
                </div>
                <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-[11px]"
                >
                    {status}
                </Badge>
            </div>

            <div className="mt-4 flex-1 min-h-0">
                <RadarChart
                    metrics={metrics}
                    size={360}
                    padding={52}
                    labelOffset={20}
                    showValues={false}
                    maxLabelChars={12}
                    className="h-full"
                />
            </div>
        </div>
    );
}
