type QuestionnaireProgressProps = {
    current: number;
    total: number;
    completed: number;
};

export function QuestionnaireProgress({
    current,
    total,
    completed,
}: QuestionnaireProgressProps) {
    const progress = total > 0 ? Math.round((current / total) * 100) : 0;
    const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    Question {current} of {total}
                </span>
                <span>{completion}% complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/80 via-primary to-[oklch(0.68_0.12_170)] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
