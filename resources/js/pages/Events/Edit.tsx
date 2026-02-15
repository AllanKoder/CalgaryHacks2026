import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard, eventsIndex, eventsUpdate } from '@/routes';

interface Event {
    id: number;
    title: string;
    description: string;
    emotional_severity: number;
    triggers: string | null;
    occurred_at: string | null;
}

interface Props {
    event: Event;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'Edit', href: '#' },
];

export default function Edit({ event }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        description: event.description,
        emotional_severity: event.emotional_severity,
        triggers: event.triggers || '',
        occurred_at: event.occurred_at || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(eventsUpdate(event.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Event" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Edit Event</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                            <CardDescription>Update event information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Brief title for this event"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="What happened in detail?"
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="emotional_severity">
                                    Emotional Severity (1-5) *
                                </Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    1 = Minimal impact, barely noticed • 5 = Severe impact, deeply affected
                                </p>
                                <Input
                                    id="emotional_severity"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={data.emotional_severity}
                                    onChange={(e) => setData('emotional_severity', parseInt(e.target.value))}
                                    required
                                />
                                {errors.emotional_severity && (
                                    <p className="text-sm text-destructive mt-1">{errors.emotional_severity}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="occurred_at">When did it happen?</Label>
                                <Input
                                    id="occurred_at"
                                    type="date"
                                    value={data.occurred_at}
                                    onChange={(e) => setData('occurred_at', e.target.value)}
                                />
                                {errors.occurred_at && (
                                    <p className="text-sm text-destructive mt-1">{errors.occurred_at}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="triggers">Triggers</Label>
                                <Textarea
                                    id="triggers"
                                    value={data.triggers}
                                    onChange={(e) => setData('triggers', e.target.value)}
                                    placeholder="What triggered this event? What were the circumstances?"
                                />
                                {errors.triggers && (
                                    <p className="text-sm text-destructive mt-1">{errors.triggers}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update Event
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
