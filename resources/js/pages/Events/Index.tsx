import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as eventsIndex, create as eventsCreate, show as eventsShow } from '@/routes/events';

interface Event {
    id: number;
    title: string;
    description: string;
    emotional_severity: number;
    analysis: string | null;
    created_at: string;
    identification: {
        tag: string;
    } | null;
    learning: {
        action_plan: string;
    } | null;
}

interface Props {
    events: Event[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'My Reflections', href: eventsIndex().url },
];

export default function Index({ events }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Reflections" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">My Reflections</h1>
                        <p className="text-sm text-muted-foreground">Document and learn from your experiences</p>
                    </div>
                    <Link href={eventsCreate().url}>
                        <Button>New Reflection</Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {events.length === 0 ? (
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-center text-muted-foreground">
                                    No reflections yet. Begin your reflective practice journey!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        events.map((event) => (
                            <Card key={event.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{event.title || event.description}</CardTitle>
                                            <CardDescription>
                                                Severity: {event.emotional_severity}/5
                                                {event.identification && (
                                                    <> • {event.identification.tag}</>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <Link href={eventsShow(event.id).url}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                {event.learning && (
                                    <CardContent>
                                        <p className="text-sm">
                                            <strong>Action Plan:</strong> {event.learning.action_plan}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
