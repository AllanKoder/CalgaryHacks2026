import { Badge } from '@/components/ui/badge';
import { RadarChart } from '@/components/charts/radar-chart';

type RigourMetric = {
    label: string;
    value: number;
};

type RigourCardProps = {
    metrics: RigourMetric[];
    status?: string;
};

export function RigourCard({ metrics, status = 'Updated today' }: RigourCardProps) {
    const score = Math.round(
        metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length,
    );

    return (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Rigour Score
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                        <span className="text-3xl font-semibold text-foreground">
                            {score}
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
                    {status}
                </Badge>
            </div>

            <div className="mt-5">
                <RadarChart metrics={metrics} />
            </div>
        </div>
    );
}
