import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard, eventsIndex, eventsEdit, eventsDestroy, eventsIdentificationCreate, eventsIdentificationEdit, eventsLearningCreate, eventsLearningEdit } from '@/routes';

interface Event {
    id: number;
    title: string;
    description: string;
    emotional_severity: number;
    triggers: string | null;
    occurred_at: string | null;
    created_at: string;
    identification: {
        tag: string;
    } | null;
    learning: {
        action_plan: string;
        next_time_strategy: string | null;
        resources: string | null;
    } | null;
}

interface Props {
    event: Event;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
];

export default function Show({ event }: Props) {
    function handleDelete() {
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(eventsDestroy(event.id).url);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Event Details" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Event Details</h1>
                    <div className="flex gap-2">
                        <Link href={eventsEdit(event.id).url}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{event.title || 'Untitled Event'}</CardTitle>
                                <CardDescription>
                                    Recorded on {new Date(event.created_at).toLocaleDateString()}
                                    {event.occurred_at && (
                                        <> • Occurred on {new Date(event.occurred_at).toLocaleDateString()}</>
                                    )}
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">Severity: {event.emotional_severity}/5</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>

                        {event.triggers && (
                            <div>
                                <h3 className="font-semibold mb-2">Triggers</h3>
                                <p className="text-sm text-muted-foreground">{event.triggers}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Identification</CardTitle>
                            {event.identification ? (
                                <Link href={eventsIdentificationEdit(event.id).url}>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </Link>
                            ) : (
                                <Link href={eventsIdentificationCreate(event.id).url}>
                                    <Button size="sm">Add Identification</Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {event.identification ? (
                            <Badge>{event.identification.tag}</Badge>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No identification added yet.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Learning & Action Plan</CardTitle>
                            {event.learning ? (
                                <Link href={eventsLearningEdit(event.id).url}>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </Link>
                            ) : (
                                <Link href={eventsLearningCreate(event.id).url}>
                                    <Button 
                                        size="sm" 
                                        disabled={!event.identification}
                                    >
                                        Add Learning
                                    </Button>
                                </Link>
                            )}
                        </div>
                        {!event.identification && (
                            <CardDescription className="mt-2">
                                Add an identification first before creating a learning entry
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {event.learning ? (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-2">Action Plan</h3>
                                    <p className="text-sm text-muted-foreground">{event.learning.action_plan}</p>
                                </div>

                                {event.learning.next_time_strategy && (
                                    <div>
                                        <h3 className="font-semibold mb-2">What to Do Next Time</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {event.learning.next_time_strategy}
                                        </p>
                                    </div>
                                )}

                                {event.learning.resources && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Resources</h3>
                                        <p className="text-sm text-muted-foreground">{event.learning.resources}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No learning entry added yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
