import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type CommunityItem = {
    title: string;
    author: string;
    time: string;
    tag: string;
    replies: number;
};

type CommunityPreviewCardProps = {
    items: CommunityItem[];
    maxItems?: number;
};

export function CommunityPreviewCard({
    items,
    maxItems,
}: CommunityPreviewCardProps) {
    const displayItems =
        typeof maxItems === 'number' ? items.slice(0, maxItems) : items;

    return (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        Community Preview
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        Fresh discussions from your network.
                    </p>
                </div>
                <Button variant="ghost" size="sm">
                    See all
                </Button>
            </div>

            <div className="mt-4 space-y-3">
                {displayItems.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border border-border/60 bg-background/70 px-3 py-2.5"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {item.title}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                    <span>
                                        {item.author} - {item.time}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px]"
                                    >
                                        {item.tag}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                <MessageCircle className="size-3.5" />
                                {item.replies}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
