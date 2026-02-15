import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { dashboard, eventsIndex, eventsShow } from '@/route-helpers';

interface Event {
    id: number;
    title: string | null;
    focus: string | null;
    description: string;
    emotional_severity: number;
    occurred_at: string | null;
    created_at: string;
    learning: {
        action_plan: string;
        next_time_strategy: string | null;
        resources: string | null;
    } | null;
}

interface Props {
    event: Event;
    question: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'AI Consulting', href: '#' },
];

export default function AiConsulting({ event, question }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        response: '',
    });

    const displayDate = event.occurred_at ?? event.created_at;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/events/${event.id}/ai-consulting`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Consulting Model" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="w-fit">AI Consulting</Badge>
                    <h1 className="text-3xl font-bold">AI Consulting Model</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        One focused question. One clear response.
                    </p>
                </div>

                <Card className="border-border/60">
                    <CardHeader className="space-y-4">
                        <div>
                            <CardTitle>Question</CardTitle>
                            <CardDescription>Answer in your own words.</CardDescription>
                        </div>
                        <div className="rounded-xl border bg-background/80 p-4 text-base font-semibold leading-relaxed">
                            {question}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{event.title || 'Reflection'}</Badge>
                            <Badge variant="outline">
                                {displayDate ? new Date(displayDate).toLocaleDateString() : 'N/A'}
                            </Badge>
                            <Badge variant="outline">Severity {event.emotional_severity}/5</Badge>
                            <Badge variant="outline">{event.focus || 'General focus'}</Badge>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Context Snapshot</p>
                            <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea
                                value={data.response}
                                onChange={(e) => setData('response', e.target.value)}
                                placeholder="Start with the moment your interpretation changed..."
                                className="min-h-[220px]"
                            />
                            {errors.response && (
                                <p className="text-sm text-destructive">{errors.response}</p>
                            )}
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="submit"
                                    disabled={processing || data.response.trim().length === 0}
                                    className="sm:w-auto"
                                >
                                    Update Learning
                                </Button>
                                <Link href={eventsShow(event.id).url} className="sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full">
                                        Back to Reflection
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {event.learning
                                    ? 'This response will be appended to your learning resources.'
                                    : 'This response will create a learning entry.'}
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
