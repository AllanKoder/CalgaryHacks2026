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
};

export function QuickReviewCard({ data }: QuickReviewCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/70 px-5 py-4 text-left shadow-sm backdrop-blur transition hover:border-border/80 hover:bg-card/80"
                >
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Quick Review
                        </p>
                        <p className="mt-2 text-base font-semibold text-foreground">
                            {data.metric}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            {data.subtitle}
                        </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground">
                        <ChevronRight className="size-4" />
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{data.dialogTitle}</DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                        {data.review}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
