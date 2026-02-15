import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<QuickReviewData>(data);

    useEffect(() => {
        setActiveItem(data);
    }, [data]);

    const handleOpen = (item: QuickReviewData) => {
        setActiveItem(item);
        setOpen(true);
    };

    const MetricRow = ({ item }: { item: QuickReviewData }) => (
        <button
            type="button"
            onClick={() => handleOpen(item)}
            className="group flex w-full items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-left shadow-sm transition hover:border-border/80 hover:bg-background/90"
        >
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
        </button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex w-full flex-col gap-3 rounded-2xl border border-border/60 bg-card/70 px-5 py-4 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Quick Review
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                        Tap a focus area
                    </span>
                </div>
                <div className="space-y-2">
                    <MetricRow item={data} />
                    {secondary && <MetricRow item={secondary} />}
                </div>
            </div>
            <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
                <div className="border-b border-border/60 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.16),_transparent_55%)] px-6 py-5">
                    <DialogHeader className="text-left">
                        <Badge
                            variant="secondary"
                            className="w-fit rounded-full px-3 py-1 text-[11px]"
                        >
                            Quick Review
                        </Badge>
                        <DialogTitle className="text-2xl font-semibold text-foreground">
                            {activeItem.dialogTitle}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            {activeItem.subtitle}
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="space-y-4 px-6 pb-6 pt-5">
                    <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            What this means
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                            {activeItem.review}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
