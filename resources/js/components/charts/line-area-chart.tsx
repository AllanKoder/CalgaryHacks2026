import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type LineAreaChartData = number[] | Record<string, number>;

type LineAreaChartProps = {
    data: LineAreaChartData;
    labels?: string[];
    height?: number;
    width?: number;
    curve?: 'smooth' | 'linear';
    className?: string;
};

type Point = {
    x: number;
    y: number;
};

export function LineAreaChart({
    data,
    labels = [],
    height = 190,
    width = 520,
    curve = 'smooth',
    className,
}: LineAreaChartProps) {
    const padding = 26;

    const { values, displayLabels } = useMemo(() => {
        if (Array.isArray(data)) {
            return { values: data, displayLabels: labels };
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

        return {
            values: entries.map(([, value]) => value),
            displayLabels: entries.map((_, index) => `Week ${index + 1}`),
        };
    }, [data, labels]);

    const minValue = 0;
    const maxValue = Math.max(100, ...values);
    const yAxisTicks = useMemo(() => {
        const tickCount = 5;
        const step = (maxValue - minValue) / (tickCount - 1 || 1);

        return Array.from({ length: tickCount }, (_, index) => {
            const value = minValue + step * index;
            return {
                value,
                label: Math.round(value).toString(),
            };
        });
    }, [maxValue, minValue]);

    const points = useMemo(() => {
        if (values.length === 0) {
            return [];
        }

        return values.map((value, index) => {
            const x =
                padding +
                ((width - padding * 2) * index) /
                    Math.max(1, values.length - 1);
            const ratio =
                (value - minValue) / Math.max(1, maxValue - minValue);
            const y = height - padding - ratio * (height - padding * 2);
            return { x, y };
        });
    }, [height, maxValue, minValue, padding, values, width]);

    const smoothPath = useMemo(() => {
        if (points.length === 0) {
            return '';
        }

        const tension = 0.4;
        const path = points.reduce((acc, point, index, arr) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }

            const prev = arr[index - 1];
            const next = arr[index + 1] ?? point;
            const cp1x = prev.x + (point.x - prev.x) * tension;
            const cp1y = prev.y + (point.y - prev.y) * tension;
            const cp2x = point.x - (next.x - prev.x) * tension;
            const cp2y = point.y - (next.y - prev.y) * tension;

            return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
        }, '');

        return path;
    }, [points]);

    const linePath = useMemo(() => {
        if (points.length === 0) {
            return '';
        }

        if (curve === 'smooth') {
            return smoothPath;
        }

        return points
            .map((point, index) =>
                index === 0
                    ? `M ${point.x} ${point.y}`
                    : `L ${point.x} ${point.y}`,
            )
            .join(' ');
    }, [curve, points, smoothPath]);

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
                            stopOpacity="0.32"
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
                        <stop offset="0%" stopColor="var(--color-chart-1)" />
                        <stop offset="100%" stopColor="var(--color-chart-2)" />
                    </linearGradient>
                    <filter
                        id="line-glow"
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                    >
                        <feDropShadow
                            dx="0"
                            dy="6"
                            stdDeviation="8"
                            floodColor="var(--color-chart-1)"
                            floodOpacity="0.2"
                        />
                    </filter>
                </defs>

                {yAxisTicks.map((tick) => {
                    const ratio =
                        (tick.value - minValue) /
                        Math.max(1, maxValue - minValue);
                    const y =
                        height - padding - ratio * (height - padding * 2);
                    return (
                        <g key={tick.value}>
                            <line
                                x1={padding}
                                x2={width - padding}
                                y1={y}
                                y2={y}
                                stroke="var(--color-border)"
                                strokeDasharray="4 6"
                                strokeOpacity="0.45"
                            />
                            <text
                                x="4"
                                y={y + 3}
                                fontSize="10"
                                fill="var(--color-muted-foreground)"
                            >
                                {tick.label}
                            </text>
                        </g>
                    );
                })}

                <path
                    d={linePath}
                    fill="none"
                    stroke="var(--color-chart-1)"
                    strokeWidth="6"
                    strokeOpacity="0.08"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d={areaPath}
                    fill="url(#line-area-gradient)"
                    stroke="none"
                />
                <path
                    d={linePath}
                    fill="none"
                    stroke="url(#line-stroke-gradient)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#line-glow)"
                />

                {points.map((point, index) => (
                    <circle
                        key={`point-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r="2.6"
                        fill="var(--color-background)"
                        stroke="var(--color-chart-1)"
                        strokeWidth="1.5"
                    />
                ))}
            </svg>

            {displayLabels.length > 0 && (
                <div
                    className="mt-3 grid gap-2 text-[11px] text-muted-foreground/80"
                    style={{
                        gridTemplateColumns: `repeat(${displayLabels.length}, minmax(0, 1fr))`,
                    }}
                >
                    {displayLabels.map((label) => (
                        <span key={label} className="text-center">
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
