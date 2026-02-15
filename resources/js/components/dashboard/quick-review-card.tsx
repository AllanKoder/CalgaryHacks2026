import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronRight } from 'lucide-react';

export type QuickReviewData = {
    metric: string;
    subtitle: string;
    dialogTitle: string;
    review: string;
};

type QuickReviewCardProps = {
    data: QuickReviewData;
    secondary?: QuickReviewData;
};

export function QuickReviewCard({ data, secondary }: QuickReviewCardProps) {
    const MetricRow = ({ item }: { item: QuickReviewData }) => (
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-base font-semibold text-foreground">
                    {item.metric}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.subtitle}
                </p>
            </div>
            <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition group-hover:text-foreground">
                <ChevronRight className="size-3.5" />
            </span>
        </div>
    );

    const DialogSection = ({ item }: { item: QuickReviewData }) => (
        <div className="rounded-xl border border-border/60 bg-background/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick Review
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
                {item.dialogTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.review}
            </p>
        </div>
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/70 px-5 py-4 text-left shadow-sm backdrop-blur transition hover:border-border/80 hover:bg-card/80"
                >
                    <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Quick Review
                        </p>
                        <div className="mt-2 space-y-2">
                            <MetricRow item={data} />
                            {secondary && (
                                <MetricRow item={secondary} />
                            )}
                        </div>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Quick Review</DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                        Two focus areas based on your current profile.
                    </DialogDescription>
                    <div className="mt-4 space-y-3">
                        <DialogSection item={data} />
                        {secondary && <DialogSection item={secondary} />}
                    </div>
                    {secondary && (
                        <div className="sr-only">{secondary.metric}</div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
