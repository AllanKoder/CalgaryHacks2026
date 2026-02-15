import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type LineAreaChartPoint = {
    x: string;
    y: number;
};

export type LineAreaChartData =
    | number[]
    | Record<string, number>
    | LineAreaChartPoint[];

type LineAreaChartProps = {
    data: LineAreaChartData;
    labels?: string[];
    height?: number;
    width?: number;
    curve?: 'smooth' | 'linear';
    smoothWindow?: number;
    labelCount?: number;
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
    smoothWindow = 1,
    labelCount = 4,
    className,
}: LineAreaChartProps) {
    const padding = 26;
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const { values, axisKeys, axisDates } = useMemo(() => {
        if (Array.isArray(data)) {
            if (data.length > 0 && typeof data[0] === 'number') {
                return {
                    values: data as number[],
                    axisKeys: labels,
                    axisDates: [],
                };
            }

            const points = data as LineAreaChartPoint[];
            const sorted = [...points].sort((a, b) => {
                const timeA = new Date(a.x).getTime();
                const timeB = new Date(b.x).getTime();
                if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
                    return a.x.localeCompare(b.x);
                }
                return timeA - timeB;
            });

            return {
                values: sorted.map((point) => point.y),
                axisKeys: sorted.map((point) => point.x),
                axisDates: sorted.map((point) => new Date(point.x)),
            };
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

        const keys = entries.map(([key]) => key);
        return {
            values: entries.map(([, value]) => value),
            axisKeys: keys,
            axisDates: keys.map((key) => new Date(key)),
        };
    }, [data, labels]);

    const smoothedValues = useMemo(() => {
        const windowSize = Math.max(1, Math.floor(smoothWindow));
        if (values.length === 0 || windowSize === 1) {
            return values;
        }

        const radius = Math.floor(windowSize / 2);
        return values.map((_, index) => {
            const start = Math.max(0, index - radius);
            const end = Math.min(values.length - 1, index + radius);
            const slice = values.slice(start, end + 1);
            const total = slice.reduce((sum, value) => sum + value, 0);
            return total / slice.length;
        });
    }, [smoothWindow, values]);

    const { minValue, maxValue } = useMemo(() => {
        if (smoothedValues.length === 0) {
            return { minValue: 0, maxValue: 100 };
        }

        const rawMin = Math.min(...smoothedValues);
        const rawMax = Math.max(...smoothedValues);
        const paddingValue = Math.max(4, (rawMax - rawMin) * 0.15);
        const min = Math.max(0, Math.floor(rawMin - paddingValue));
        const max = Math.min(100, Math.ceil(rawMax + paddingValue));
        return {
            minValue: min,
            maxValue: Math.max(min + 1, max),
        };
    }, [smoothedValues]);
    const yAxisTicks = useMemo(() => {
        const tickCount = 4;
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
        if (smoothedValues.length === 0) {
            return [];
        }

        return smoothedValues.map((value, index) => {
            const x =
                padding +
                ((width - padding * 2) * index) /
                    Math.max(1, smoothedValues.length - 1);
            const ratio =
                (value - minValue) / Math.max(1, maxValue - minValue);
            const y = height - padding - ratio * (height - padding * 2);
            return { x, y };
        });
    }, [height, maxValue, minValue, padding, smoothedValues, width]);

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

    const axisLabels = useMemo(() => {
        if (axisKeys.length === 0) {
            return [];
        }

        const validDates =
            axisDates.length === axisKeys.length &&
            axisDates.length > 0 &&
            axisDates.every((date) => !Number.isNaN(date.getTime()));

        if (validDates) {
            const start = axisDates[0];
            const end = axisDates[axisDates.length - 1];
            const msWeek = 7 * 24 * 60 * 60 * 1000;
            const totalWeeks =
                Math.max(
                    1,
                    Math.floor((end.getTime() - start.getTime()) / msWeek) + 1,
                );
            const desired = Math.max(2, Math.min(labelCount, totalWeeks));

            if (desired <= 1) {
                return ['Week 1'];
            }

            const labels = Array.from({ length: desired }, (_, index) => {
                const week = Math.round(
                    1 + (totalWeeks - 1) * (index / (desired - 1)),
                );
                return `Week ${week}`;
            });

            return Array.from(new Set(labels));
        }

        const desired = Math.max(2, Math.min(labelCount, axisKeys.length));
        if (axisKeys.length <= desired) {
            return axisKeys;
        }

        const lastIndex = axisKeys.length - 1;
        return Array.from({ length: desired }, (_, index) => {
            const idx = Math.round((lastIndex * index) / (desired - 1));
            return axisKeys[idx];
        });
    }, [axisDates, axisKeys, labelCount]);

    const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
        if (points.length === 0) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) * width;
        const clampedX = Math.max(padding, Math.min(width - padding, relativeX));
        const progress =
            (clampedX - padding) / Math.max(1, width - padding * 2);
        const index = Math.round(progress * (points.length - 1));
        setHoverIndex(Math.max(0, Math.min(points.length - 1, index)));
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    const tooltip = useMemo(() => {
        if (hoverIndex === null || !points[hoverIndex]) {
            return null;
        }

        const rawDate = axisDates[hoverIndex];
        const formattedDate =
            rawDate && !Number.isNaN(rawDate.getTime())
                ? rawDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                  })
                : axisKeys[hoverIndex] ?? `Point ${hoverIndex + 1}`;
        const rawValue = values[hoverIndex];

        return {
            x: points[hoverIndex].x,
            y: points[hoverIndex].y,
            label: formattedDate,
            value:
                typeof rawValue === 'number'
                    ? rawValue.toFixed(1)
                    : String(rawValue),
        };
    }, [axisDates, axisKeys, hoverIndex, points, values]);

    return (
        <div className={cn('relative flex h-full w-full flex-col', className)}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full flex-1 min-h-0"
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
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
                            stopOpacity="0.18"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity="0"
                        />
                    </linearGradient>
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
                                strokeDasharray="4 8"
                                strokeOpacity="0.25"
                            />
                            <text
                                x="4"
                                y={y + 3}
                                fontSize="9"
                                fontWeight="500"
                                letterSpacing="-0.2"
                                fill="var(--color-muted-foreground)"
                                opacity="0.7"
                            >
                                {tick.label}
                            </text>
                        </g>
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
                    stroke="var(--color-chart-1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {tooltip && (
                    <g>
                        <line
                            x1={tooltip.x}
                            x2={tooltip.x}
                            y1={padding}
                            y2={height - padding}
                            stroke="var(--color-border)"
                            strokeOpacity="0.5"
                            strokeDasharray="3 6"
                        />
                        <circle
                            cx={tooltip.x}
                            cy={tooltip.y}
                            r="4.2"
                            fill="var(--color-background)"
                            stroke="var(--color-chart-1)"
                            strokeWidth="2"
                        />
                    </g>
                )}
            </svg>

            {tooltip && (
                <div
                    className="pointer-events-none absolute rounded-xl border border-border/60 bg-card/95 px-3 py-2 text-xs text-foreground shadow-lg backdrop-blur"
                    style={{
                        left: `${(tooltip.x / width) * 100}%`,
                        top: `${(tooltip.y / height) * 100}%`,
                        transform: 'translate(-50%, -120%)',
                    }}
                >
                    <div className="text-[11px] text-muted-foreground">
                        {tooltip.label}
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                        {tooltip.value}
                    </div>
                </div>
            )}

            {axisLabels.length > 0 && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground/80">
                    {axisLabels.map((label, index) => (
                        <span
                            key={`${label}-${index}`}
                            className="tabular-nums"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
