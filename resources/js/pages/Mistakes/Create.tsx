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
    { title: 'Mistakes', href: '/mistakes' },
    { title: 'Create', href: '/mistakes/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        description: '',
        emotional_severity: 5,
        analysis: '',
        identification_tag: '',
        action_plan: '',
        next_time_strategy: '',
        resources: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/mistakes');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record a Mistake" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Record a Mistake</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mistake Details</CardTitle>
                            <CardDescription>Describe what happened</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="What mistake did you make?"
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
                                    placeholder="Why was this bad? How did it happen? What were the triggers?"
                                />
                                {errors.analysis && (
                                    <p className="text-sm text-destructive mt-1">{errors.analysis}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Identification</CardTitle>
                            <CardDescription>Categorize the mental aspect</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="identification_tag">Mental Problem Tag</Label>
                                <Input
                                    id="identification_tag"
                                    value={data.identification_tag}
                                    onChange={(e) => setData('identification_tag', e.target.value)}
                                    placeholder="e.g., Anxiety, Procrastination, Self-Doubt"
                                />
                                {errors.identification_tag && (
                                    <p className="text-sm text-destructive mt-1">{errors.identification_tag}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Learning & Action Plan</CardTitle>
                            <CardDescription>What will you do differently?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="action_plan">Action Plan</Label>
                                <Textarea
                                    id="action_plan"
                                    value={data.action_plan}
                                    onChange={(e) => setData('action_plan', e.target.value)}
                                    placeholder="What steps will you take to prevent this?"
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
                            Save Mistake
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
