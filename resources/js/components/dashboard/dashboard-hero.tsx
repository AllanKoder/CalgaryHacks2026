import { AnalyzeButton } from '@/components/dashboard/analyze-button';

type DashboardHeroProps = {
    name: string;
};

export function DashboardHero({ name }: DashboardHeroProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                        Sharpen your thinking.
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground md:text-base">
                        Welcome back, {name}. Your reasoning signals are up and
                        improving.
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <AnalyzeButton />
            </div>
        </div>
    );
}
