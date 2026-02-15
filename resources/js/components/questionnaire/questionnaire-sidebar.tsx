import { Badge } from '@/components/ui/badge';

type SectionProgress = {
    label: string;
    total: number;
    completed: number;
};

type QuestionnaireSidebarProps = {
    total: number;
    completed: number;
    nextLabel?: string;
    sections: SectionProgress[];
};

export function QuestionnaireSidebar({
    total,
    completed,
    nextLabel,
    sections,
}: QuestionnaireSidebarProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-foreground">
                    Session Overview
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {completed} of {total} answered
                </p>
                <div className="mt-4 flex items-center gap-3">
                    <div className="text-3xl font-semibold text-foreground">
                        {total === 0 ? '0' : Math.round((completed / total) * 100)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Completion
                    </div>
                </div>
                {nextLabel && (
                    <div className="mt-4">
                        <Badge
                            variant="secondary"
                            className="rounded-full bg-secondary/80 px-3 py-1 text-[11px]"
                        >
                            Next up: {nextLabel}
                        </Badge>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-foreground">
                    Focus Areas
                </p>
                <div className="mt-4 space-y-3">
                    {sections.map((section) => {
                        const progress =
                            section.total === 0
                                ? 0
                                : Math.round(
                                      (section.completed / section.total) * 100,
                                  );
                        return (
                            <div key={section.label} className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{section.label}</span>
                                    <span>
                                        {section.completed}/{section.total}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary/70 to-[oklch(0.68_0.12_170)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
