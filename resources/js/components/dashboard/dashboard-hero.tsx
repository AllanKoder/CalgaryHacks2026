import { Link } from '@inertiajs/react';
import { CalendarCheck, Sparkles } from 'lucide-react';
import { AnalyzeButton } from '@/components/dashboard/analyze-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { questionnaire } from '@/route-helpers';

type DashboardHeroProps = {
    name: string;
};

export function DashboardHero({ name }: DashboardHeroProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
                <Badge
                    variant="secondary"
                    className="w-fit gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                >
                    <Sparkles className="size-3.5 text-primary" />
                    Adaptive intelligence active
                </Badge>
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
                <Button variant="outline" className="bg-white/70" asChild>
                    <Link href={questionnaire()} prefetch>
                        <CalendarCheck className="size-4" />
                        Review decisions
                    </Link>
                </Button>
                <AnalyzeButton />
            </div>
        </div>
    );
}
