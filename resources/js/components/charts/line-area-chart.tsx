import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type LineAreaChartProps = {
    data: number[];
    labels?: string[];
    height?: number;
    width?: number;
    className?: string;
};

type Point = {
    x: number;
    y: number;
};

export function LineAreaChart({
    data,
    labels = [],
    height = 180,
    width = 520,
    className,
}: LineAreaChartProps) {
    const padding = 22;
    const minValue = 0;
    const maxValue = Math.max(100, ...data);

    const points = useMemo(() => {
        if (data.length === 0) {
            return [];
        }

        return data.map((value, index) => {
            const x =
                padding +
                ((width - padding * 2) * index) / Math.max(1, data.length - 1);
            const ratio =
                (value - minValue) / Math.max(1, maxValue - minValue);
            const y = height - padding - ratio * (height - padding * 2);
            return { x, y };
        });
    }, [data, height, maxValue, minValue, padding, width]);

    const linePath = useMemo(() => {
        if (points.length === 0) {
            return '';
        }

        return points
            .map((point, index) =>
                index === 0
                    ? `M ${point.x} ${point.y}`
                    : `L ${point.x} ${point.y}`,
            )
            .join(' ');
    }, [points]);

    const areaPath = useMemo(() => {
        if (points.length === 0) {
            return '';
        }

        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];
        const baseline = height - padding;

        return `${linePath} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`;
    }, [height, linePath, padding, points]);

    return (
        <div className={cn('w-full', className)}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-48 w-full"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient
                        id="line-area-gradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity="0.35"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="line-stroke-gradient"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="0"
                    >
                        <stop
                            offset="0%"
                            stopColor="var(--color-chart-1)"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-chart-2)"
                        />
                    </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((ratio) => {
                    const y =
                        height - padding - ratio * (height - padding * 2);
                    return (
                        <line
                            key={ratio}
                            x1={padding}
                            x2={width - padding}
                            y1={y}
                            y2={y}
                            stroke="var(--color-border)"
                            strokeDasharray="4 6"
                            strokeOpacity="0.6"
                        />
                    );
                })}

                <path
                    d={areaPath}
                    fill="url(#line-area-gradient)"
                    stroke="none"
                />
                <path
                    d={linePath}
                    fill="none"
                    stroke="url(#line-stroke-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point, index) => (
                    <circle
                        key={`point-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="var(--color-background)"
                        stroke="var(--color-chart-1)"
                        strokeWidth="2"
                    />
                ))}
            </svg>

            {labels.length > 0 && (
                <div
                    className="mt-3 grid gap-2 text-xs text-muted-foreground"
                    style={{
                        gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
                    }}
                >
                    {labels.map((label) => (
                        <span key={label} className="text-center">
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
