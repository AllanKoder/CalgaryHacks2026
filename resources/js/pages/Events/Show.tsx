import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard, eventsIndex, eventsEdit, eventsDestroy, eventsIdentificationCreate, eventsIdentificationEdit, eventsLearningCreate, eventsLearningEdit } from '@/route-helpers';

interface Event {
    id: number;
    title: string;
    description: string;
    emotional_severity: number;
    triggers: string | null;
    occurred_at: string | null;
    created_at: string;
    // Context fields
    location: string | null;
    people_present: string | null;
    power_dynamics: string | null;
    what_happened_before: string | null;
    mental_emotional_state: string | null;
    organizational_pressures: string | null;
    // Impact fields
    directly_affected: string | null;
    indirectly_affected: string | null;
    immediate_consequences: string | null;
    longer_term_consequences: string | null;
    impact_significance: number | null;
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

                {(event.location || event.people_present || event.power_dynamics || 
                  event.what_happened_before || event.mental_emotional_state || 
                  event.organizational_pressures) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Context</CardTitle>
                            <CardDescription>Understanding the environment and circumstances</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {event.location && (
                                <div>
                                    <h3 className="font-semibold mb-2">Where did this happen?</h3>
                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                </div>
                            )}

                            {event.people_present && (
                                <div>
                                    <h3 className="font-semibold mb-2">Who was present?</h3>
                                    <p className="text-sm text-muted-foreground">{event.people_present}</p>
                                </div>
                            )}

                            {event.power_dynamics && (
                                <div>
                                    <h3 className="font-semibold mb-2">What were the power dynamics?</h3>
                                    <p className="text-sm text-muted-foreground">{event.power_dynamics}</p>
                                </div>
                            )}

                            {event.what_happened_before && (
                                <div>
                                    <h3 className="font-semibold mb-2">What was happening right before?</h3>
                                    <p className="text-sm text-muted-foreground">{event.what_happened_before}</p>
                                </div>
                            )}

                            {event.mental_emotional_state && (
                                <div>
                                    <h3 className="font-semibold mb-2">What was your mental/emotional state?</h3>
                                    <p className="text-sm text-muted-foreground">{event.mental_emotional_state}</p>
                                </div>
                            )}

                            {event.organizational_pressures && (
                                <div>
                                    <h3 className="font-semibold mb-2">Were there organizational/time/resource pressures?</h3>
                                    <p className="text-sm text-muted-foreground">{event.organizational_pressures}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {(event.directly_affected || event.indirectly_affected || 
                  event.immediate_consequences || event.longer_term_consequences || 
                  event.impact_significance) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Impact</CardTitle>
                            <CardDescription>Understanding the consequences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {event.directly_affected && (
                                <div>
                                    <h3 className="font-semibold mb-2">Who was directly affected? How?</h3>
                                    <p className="text-sm text-muted-foreground">{event.directly_affected}</p>
                                </div>
                            )}

                            {event.indirectly_affected && (
                                <div>
                                    <h3 className="font-semibold mb-2">Who was indirectly affected?</h3>
                                    <p className="text-sm text-muted-foreground">{event.indirectly_affected}</p>
                                </div>
                            )}

                            {event.immediate_consequences && (
                                <div>
                                    <h3 className="font-semibold mb-2">What were the immediate consequences?</h3>
                                    <p className="text-sm text-muted-foreground">{event.immediate_consequences}</p>
                                </div>
                            )}

                            {event.longer_term_consequences && (
                                <div>
                                    <h3 className="font-semibold mb-2">What could the longer-term consequences be?</h3>
                                    <p className="text-sm text-muted-foreground">{event.longer_term_consequences}</p>
                                </div>
                            )}

                            {event.impact_significance && (
                                <div>
                                    <h3 className="font-semibold mb-2">Impact Significance</h3>
                                    <Badge variant="secondary">{event.impact_significance}/10</Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

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
