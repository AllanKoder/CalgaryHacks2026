import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/events' },
    { title: 'Create', href: '/events/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        description: '',
        emotional_severity: 5,
        analysis: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/events');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record an Event" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Record an Event</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                            <CardDescription>Describe what happened</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="What happened?"
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="emotional_severity">
                                    Emotional Severity (1-10) *
                                </Label>
                                <Input
                                    id="emotional_severity"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={data.emotional_severity}
                                    onChange={(e) => setData('emotional_severity', parseInt(e.target.value))}
                                    required
                                />
                                {errors.emotional_severity && (
                                    <p className="text-sm text-destructive mt-1">{errors.emotional_severity}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="analysis">Analysis</Label>
                                <Textarea
                                    id="analysis"
                                    value={data.analysis}
                                    onChange={(e) => setData('analysis', e.target.value)}
                                    placeholder="Why was this significant? How did it happen? What were the triggers?"
                                />
                                {errors.analysis && (
                                    <p className="text-sm text-destructive mt-1">{errors.analysis}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save Event
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
