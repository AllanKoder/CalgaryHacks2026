import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { index as eventsIndex, edit as eventsEdit, destroy as eventsDestroy } from '@/routes/events';
import { create as eventsIdentificationCreate, edit as eventsIdentificationEdit } from '@/routes/events/identification';
import { create as eventsLearningCreate, edit as eventsLearningEdit } from '@/routes/events/learning';
import { MAIN_CATEGORY_LABELS, SUBCATEGORIES, type MainCategory } from '@/lib/categories';

interface Event {
    id: number;
    title: string;
    description: string;
    emotional_severity: number;
    triggers: string | null;
    occurred_at: string | null;
    created_at: string;
    context: {
        location: string | null;
        people_present: string | null;
        power_dynamics: string | null;
        what_happened_before: string | null;
        mental_emotional_state: string | null;
        organizational_pressures: string | null;
    } | null;
    impact: {
        directly_affected: string | null;
        indirectly_affected: string | null;
        immediate_consequences: string | null;
        longer_term_consequences: string | null;
        impact_significance: number | null;
    } | null;
    identification: {
        tag: string;
        main_category: string | null;
        sub_category: string | null;
        assumptions: {
            what_assumptions: string | null;
            ignored_information: string | null;
            protected_beliefs: string | null;
        } | null;
        pattern_recognition: {
            noticed_before: string | null;
            triggers: string | null;
            personal_or_organizational: string | null;
            common_thread: string | null;
        } | null;
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

                {(event.context?.location || event.context?.people_present || event.context?.power_dynamics ||
                  event.context?.what_happened_before || event.context?.mental_emotional_state ||
                  event.context?.organizational_pressures) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Context</CardTitle>
                            <CardDescription>Understanding the environment and circumstances</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {event.context?.location && (
                                <div>
                                    <h3 className="font-semibold mb-2">Where did this happen?</h3>
                                    <p className="text-sm text-muted-foreground">{event.context.location}</p>
                                </div>
                            )}

                            {event.context?.people_present && (
                                <div>
                                    <h3 className="font-semibold mb-2">Who was present?</h3>
                                    <p className="text-sm text-muted-foreground">{event.context.people_present}</p>
                                </div>
                            )}

                            {event.context?.power_dynamics && (
                                <div>
                                    <h3 className="font-semibold mb-2">What were the power dynamics?</h3>
                                    <p className="text-sm text-muted-foreground">{event.context.power_dynamics}</p>
                                </div>
                            )}

                            {event.context?.what_happened_before && (
                                <div>
                                    <h3 className="font-semibold mb-2">What was happening right before?</h3>
                                    <p className="text-sm text-muted-foreground">{event.context.what_happened_before}</p>
                                </div>
                            )}

                            {event.context?.mental_emotional_state && (
                                <div>
                                    <h3 className="font-semibold mb-2">What was your mental/emotional state?</h3>
                                    <p className="text-sm text-muted-foreground">{event.context.mental_emotional_state}</p>
                                </div>
                            )}

                            {event.context?.organizational_pressures && (
                                <div>
                                    <h3 className="font-semibold mb-2">Were there organizational/time/resource pressures?</h3>
                                    <p className="text-sm text-muted-foreground">{event.context.organizational_pressures}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {(event.impact?.directly_affected || event.impact?.indirectly_affected ||
                  event.impact?.immediate_consequences || event.impact?.longer_term_consequences ||
                  event.impact?.impact_significance) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Impact</CardTitle>
                            <CardDescription>Understanding the consequences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {event.impact?.directly_affected && (
                                <div>
                                    <h3 className="font-semibold mb-2">Who was directly affected? How?</h3>
                                    <p className="text-sm text-muted-foreground">{event.impact.directly_affected}</p>
                                </div>
                            )}

                            {event.impact?.indirectly_affected && (
                                <div>
                                    <h3 className="font-semibold mb-2">Who was indirectly affected?</h3>
                                    <p className="text-sm text-muted-foreground">{event.impact.indirectly_affected}</p>
                                </div>
                            )}

                            {event.impact?.immediate_consequences && (
                                <div>
                                    <h3 className="font-semibold mb-2">What were the immediate consequences?</h3>
                                    <p className="text-sm text-muted-foreground">{event.impact.immediate_consequences}</p>
                                </div>
                            )}

                            {event.impact?.longer_term_consequences && (
                                <div>
                                    <h3 className="font-semibold mb-2">What could the longer-term consequences be?</h3>
                                    <p className="text-sm text-muted-foreground">{event.impact.longer_term_consequences}</p>
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
                            <div className="space-y-6">

                                {event.identification.main_category && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm text-muted-foreground">Category</h3>
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

                                {event.identification.assumptions && (
                                    Object.values(event.identification.assumptions).some(val => val) && (
                                        <div className="space-y-3">
                                            <h3 className="font-semibold">Self-Awareness</h3>

                                            {event.identification.assumptions.what_assumptions && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        What assumptions did you make?
                                                    </h4>
                                                    <p className="text-sm">{event.identification.assumptions.what_assumptions}</p>
                                                </div>
                                            )}

                                            {event.identification.assumptions.ignored_information && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        What information did you ignore?
                                                    </h4>
                                                    <p className="text-sm">{event.identification.assumptions.ignored_information}</p>
                                                </div>
                                            )}

                                            {event.identification.assumptions.protected_beliefs && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        What beliefs were you protecting?
                                                    </h4>
                                                    <p className="text-sm">{event.identification.assumptions.protected_beliefs}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}

                                {event.identification.pattern_recognition && (
                                    Object.values(event.identification.pattern_recognition).some(val => val) && (
                                        <div className="space-y-3">
                                            <h3 className="font-semibold">Pattern Recognition</h3>

                                            {event.identification.pattern_recognition.noticed_before && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        Have you noticed this before?
                                                    </h4>
                                                    <p className="text-sm">{event.identification.pattern_recognition.noticed_before}</p>
                                                </div>
                                            )}

                                            {event.identification.pattern_recognition.triggers && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        What triggers this?
                                                    </h4>
                                                    <p className="text-sm">{event.identification.pattern_recognition.triggers}</p>
                                                </div>
                                            )}

                                            {event.identification.pattern_recognition.personal_or_organizational && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        Personal or organizational?
                                                    </h4>
                                                    <p className="text-sm">{event.identification.pattern_recognition.personal_or_organizational}</p>
                                                </div>
                                            )}

                                            {event.identification.pattern_recognition.common_thread && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                        Common thread
                                                    </h4>
                                                    <p className="text-sm">{event.identification.pattern_recognition.common_thread}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
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
