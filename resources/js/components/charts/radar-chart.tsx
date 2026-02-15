import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type RadarMetric = {
    label: string;
    value: number;
};

type RadarChartProps = {
    metrics: RadarMetric[];
    maxValue?: number;
    levels?: number;
    size?: number;
    className?: string;
};

type RadarPoint = {
    x: number;
    y: number;
};

export function RadarChart({
    metrics,
    maxValue = 100,
    levels = 5,
    size = 260,
    className,
}: RadarChartProps) {
    const {
        center,
        radius,
        angleStep,
        gridPaths,
        axisLines,
        dataPath,
        dataPoints,
        labelPoints,
    } = useMemo(() => {
        const count = Math.max(metrics.length, 3);
        const centerPoint = size / 2;
        const outerRadius = size / 2 - 28;
        const step = (Math.PI * 2) / count;

        const polarPoint = (r: number, index: number) => {
            const angle = -Math.PI / 2 + index * step;
            return {
                x: centerPoint + r * Math.cos(angle),
                y: centerPoint + r * Math.sin(angle),
            };
        };

        const buildPath = (points: RadarPoint[]) => {
            if (points.length === 0) return '';
            return points
                .map((point, index) =>
                    index === 0
                        ? `M ${point.x} ${point.y}`
                        : `L ${point.x} ${point.y}`,
                )
                .join(' ')
                .concat(' Z');
        };

        const grids = Array.from({ length: levels }, (_, levelIndex) => {
            const gridRadius = (outerRadius * (levelIndex + 1)) / levels;
            const gridPoints = Array.from({ length: count }, (_, index) =>
                polarPoint(gridRadius, index),
            );
            return buildPath(gridPoints);
        });

        const axes = Array.from({ length: count }, (_, index) => {
            const target = polarPoint(outerRadius, index);
            return { x: target.x, y: target.y };
        });

        const values = metrics.map((metric) =>
            Math.max(0, Math.min(1, metric.value / maxValue)),
        );
        const dataPts = values.map((ratio, index) =>
            polarPoint(outerRadius * ratio, index),
        );
        const dataPathValue = buildPath(dataPts);

        const labels = Array.from({ length: count }, (_, index) =>
            polarPoint(outerRadius + 20, index),
        );

        return {
            center: centerPoint,
            radius: outerRadius,
            angleStep: step,
            gridPaths: grids,
            axisLines: axes,
            dataPath: dataPathValue,
            dataPoints: dataPts,
            labelPoints: labels,
        };
    }, [levels, maxValue, metrics, size]);

    const labelForIndex = (index: number) =>
        metrics[index]?.label ?? `Metric ${index + 1}`;
    const valueForIndex = (index: number) =>
        metrics[index]?.value ?? 0;

    return (
        <div className={cn('w-full', className)}>
            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="h-auto w-full"
                role="img"
            >
                <defs>
                    <linearGradient
                        id="radar-fill"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="var(--color-chart-2)"
                            stopOpacity="0.45"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity="0.25"
                        />
                    </linearGradient>
                </defs>

                {gridPaths.map((path, index) => (
                    <path
                        key={`grid-${index}`}
                        d={path}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeOpacity="0.7"
                        strokeDasharray={index === gridPaths.length - 1 ? '' : '4 6'}
                    />
                ))}

                {axisLines.map((axis, index) => (
                    <line
                        key={`axis-${index}`}
                        x1={center}
                        y1={center}
                        x2={axis.x}
                        y2={axis.y}
                        stroke="var(--color-border)"
                        strokeOpacity="0.6"
                    />
                ))}

                <path
                    d={dataPath}
                    fill="url(#radar-fill)"
                    stroke="var(--color-chart-1)"
                    strokeWidth="2"
                />

                {dataPoints.map((point, index) => (
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

                {labelPoints.map((point, index) => {
                    const anchor =
                        point.x > center + radius * 0.15
                            ? 'start'
                            : point.x < center - radius * 0.15
                              ? 'end'
                              : 'middle';
                    return (
                        <text
                            key={`label-${index}`}
                            x={point.x}
                            y={point.y}
                            textAnchor={anchor}
                            dominantBaseline="central"
                            className="text-[10px] font-medium fill-muted-foreground"
                        >
                            <tspan>{labelForIndex(index)}</tspan>
                            <tspan
                                x={point.x}
                                dy="1.2em"
                                className="text-[10px] fill-muted-foreground/60"
                            >
                                {valueForIndex(index)}
                            </tspan>
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
