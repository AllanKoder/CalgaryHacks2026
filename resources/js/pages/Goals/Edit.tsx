import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import { index as eventsIndex } from '@/routes/events';
import { update as eventsGoalUpdate } from '@/routes/events/goal';

interface Event {
    id: number;
    description: string;
}

interface Goal {
    id: number;
    main_category: string;
    description: string | null;
}

interface Props {
    event: Event;
    goal: Goal;
}

const GOAL_CATEGORIES = [
    { value: 'behavioral', label: 'Behavioral Change' },
    { value: 'cognitive', label: 'Cognitive Shift' },
    { value: 'emotional', label: 'Emotional Regulation' },
    { value: 'relational', label: 'Relational Improvement' },
    { value: 'systemic', label: 'Systemic Change' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'Edit Goal', href: '#' },
];

export default function Edit({ event, goal }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        main_category: goal.main_category,
        description: goal.description || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(eventsGoalUpdate(event.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Goal" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Edit Goal</h1>
                <p className="text-muted-foreground">Event: {event.description}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Goal Definition</CardTitle>
                            <CardDescription>Update your improvement goal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="main_category">Goal Category *</Label>
                                <Select value={data.main_category} onValueChange={(value) => setData('main_category', value)}>
                                    <SelectTrigger id="main_category">
                                        <SelectValue placeholder="Select a goal category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GOAL_CATEGORIES.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.main_category && (
                                    <p className="text-sm text-destructive mt-1">{errors.main_category}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">Goal Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe what you want to achieve or change..."
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Update Goal
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
