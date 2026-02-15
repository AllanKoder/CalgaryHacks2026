import { Head } from '@inertiajs/react';
import Comments from '@/components/Comments';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { MAIN_CATEGORY_LABELS, SUBCATEGORIES, type MainCategory } from '@/lib/categories';
import { dashboard } from '@/route-helpers';
import type { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
}

interface Identification {
    id: number;
    tag: string | null;
    main_category: string | null;
    sub_category: string | null;
}

interface Event {
    id: number;
    title: string;
    focus: string | null;
    description: string;
    emotional_severity: number;
    user: User;
    identification: Identification | null;
}

interface Props {
    events: Event[];
}

export default function Community({ events }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Community', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Community" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold">Community</h1>
                    <p className="text-muted-foreground mt-2">
                        Learn from others' experiences and share your insights
                    </p>
                </div>

                {events.length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-muted-foreground">
                                No community posts yet. Share your events to get started!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {events.map((event) => (
                            <Card key={event.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <CardTitle>{event.title}</CardTitle>
                                                {event.focus && (
                                                    <Badge variant="outline">{event.focus}</Badge>
                                                )}
                                            </div>
                                            <CardDescription>
                                                Shared by {event.user.name}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={
                                            event.emotional_severity >= 4 ? 'destructive' :
                                            event.emotional_severity >= 3 ? 'default' :
                                            'secondary'
                                        }>
                                            Severity: {event.emotional_severity}/5
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Event Description */}
                                    <div>
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                    </div>

                                    {/* Identification */}
                                    {event.identification && (
                                        <div className="border-t pt-4">
                                            <h3 className="font-semibold mb-3">Identification</h3>
                                            {event.identification.main_category && (
                                                <div className="space-y-2">
                                                    <p className="text-sm">
                                                        {MAIN_CATEGORY_LABELS[event.identification.main_category as MainCategory]}
                                                        {event.identification.sub_category && (
                                                            <>
                                                                {' → '}
                                                                <Badge variant="secondary">
                                                                    {SUBCATEGORIES[event.identification.main_category as MainCategory]?.find(
                                                                        sub => sub.value === event.identification!.sub_category
                                                                    )?.label || event.identification.sub_category}
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Comments Section */}
                                    <div className="border-t pt-4">
                                        <Comments commentableType="event" commentableId={event.id} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
