import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard, eventsIndex, eventsIdentificationUpdate } from '@/route-helpers';

interface Event {
    id: number;
    description: string;
}

interface Identification {
    id: number;
    tag: string;
}

interface Props {
    event: Event;
    identification: Identification;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'Edit Identification', href: '#' },
];

export default function Edit({ event, identification }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        tag: identification.tag,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(eventsIdentificationUpdate(event.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Identification" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Edit Identification</h1>
                <p className="text-muted-foreground">Event: {event.description}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identification</CardTitle>
                            <CardDescription>Update the mental aspect categorization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="tag">Mental Problem Tag *</Label>
                                <Input
                                    id="tag"
                                    value={data.tag}
                                    onChange={(e) => setData('tag', e.target.value)}
                                    placeholder="e.g., Anxiety, Procrastination, Self-Doubt"
                                    required
                                />
                                {errors.tag && (
                                    <p className="text-sm text-destructive mt-1">{errors.tag}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update Identification
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
