import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard, eventsIndex, eventsLearningStore } from '@/routes';

interface Event {
    id: number;
    description: string;
}

interface Props {
    event: Event;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'Add Learning', href: '#' },
];

export default function Create({ event }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        action_plan: '',
        next_time_strategy: '',
        resources: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(eventsLearningStore(event.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Learning" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Add Learning & Action Plan</h1>
                <p className="text-muted-foreground">Event: {event.description}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Learning & Action Plan</CardTitle>
                            <CardDescription>What will you do differently?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="action_plan">Action Plan *</Label>
                                <Textarea
                                    id="action_plan"
                                    value={data.action_plan}
                                    onChange={(e) => setData('action_plan', e.target.value)}
                                    placeholder="What steps will you take to prevent this?"
                                    required
                                />
                                {errors.action_plan && (
                                    <p className="text-sm text-destructive mt-1">{errors.action_plan}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="next_time_strategy">What to Do Next Time</Label>
                                <Textarea
                                    id="next_time_strategy"
                                    value={data.next_time_strategy}
                                    onChange={(e) => setData('next_time_strategy', e.target.value)}
                                    placeholder="When faced with similar situation..."
                                />
                                {errors.next_time_strategy && (
                                    <p className="text-sm text-destructive mt-1">{errors.next_time_strategy}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="resources">Resources to Help</Label>
                                <Textarea
                                    id="resources"
                                    value={data.resources}
                                    onChange={(e) => setData('resources', e.target.value)}
                                    placeholder="People, tools, techniques that can help you"
                                />
                                {errors.resources && (
                                    <p className="text-sm text-destructive mt-1">{errors.resources}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save Learning
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
