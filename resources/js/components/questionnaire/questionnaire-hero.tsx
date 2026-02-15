import { Brain, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuestionnaireProgress } from '@/components/questionnaire/questionnaire-progress';

type QuestionnaireHeroProps = {
    current: number;
    total: number;
    completed: number;
};

export function QuestionnaireHero({
    current,
    total,
    completed,
}: QuestionnaireHeroProps) {
    return (
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                    <Badge
                        variant="secondary"
                        className="w-fit gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                        <ClipboardList className="size-3.5 text-primary" />
                        Decision Review
                    </Badge>
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                            Evidence-based reflection.
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Answer each prompt to refine your decision patterns
                            and unlock deeper insights.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Brain className="size-4 text-primary" />
                    Adaptive model tuning in progress
                </div>
            </div>

            <div className="mt-6">
                <QuestionnaireProgress
                    current={current}
                    total={total}
                    completed={completed}
                />
            </div>
        </div>
    );
}
