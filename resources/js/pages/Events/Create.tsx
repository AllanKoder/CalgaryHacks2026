import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { index as eventsIndex, create as eventsCreate, store as eventsStore } from '@/routes/events';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'Create', href: eventsCreate().url },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        emotional_severity: 3,
        triggers: '',
        occurred_at: '',
        context: {
            location: '',
            people_present: '',
            power_dynamics: '',
            what_happened_before: '',
            mental_emotional_state: '',
            organizational_pressures: '',
        },
        impact: {
            directly_affected: '',
            indirectly_affected: '',
            immediate_consequences: '',
            longer_term_consequences: '',
            impact_significance: 5,
        },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(eventsStore().url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record an Event" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Record an Event</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>What happened?</CardDescription>
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Context</CardTitle>
                            <CardDescription>Understanding the environment and circumstances</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="location">Where did this happen?</Label>
                                <Input
                                    id="location"
                                    value={data.context.location}
                                    onChange={(e) => setData('context', { ...data.context, location: e.target.value })}
                                    placeholder="Setting/environment"
                                />
                                {errors['context.location'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['context.location']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="people_present">Who was present?</Label>
                                <Textarea
                                    id="people_present"
                                    value={data.context.people_present}
                                    onChange={(e) => setData('context', { ...data.context, people_present: e.target.value })}
                                    placeholder="Who else was there?"
                                />
                                {errors['context.people_present'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['context.people_present']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="power_dynamics">What were the power dynamics?</Label>
                                <Textarea
                                    id="power_dynamics"
                                    value={data.context.power_dynamics}
                                    onChange={(e) => setData('context', { ...data.context, power_dynamics: e.target.value })}
                                    placeholder="Authority, hierarchy, relationships"
                                />
                                {errors['context.power_dynamics'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['context.power_dynamics']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="what_happened_before">What was happening right before?</Label>
                                <Textarea
                                    id="what_happened_before"
                                    value={data.context.what_happened_before}
                                    onChange={(e) => setData('context', { ...data.context, what_happened_before: e.target.value })}
                                    placeholder="Events leading up to this"
                                />
                                {errors['context.what_happened_before'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['context.what_happened_before']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="mental_emotional_state">What was your mental/emotional state?</Label>
                                <Textarea
                                    id="mental_emotional_state"
                                    value={data.context.mental_emotional_state}
                                    onChange={(e) => setData('context', { ...data.context, mental_emotional_state: e.target.value })}
                                    placeholder="Rushed, tired, stressed, distracted?"
                                />
                                {errors['context.mental_emotional_state'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['context.mental_emotional_state']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="organizational_pressures">Were there organizational/time/resource pressures?</Label>
                                <Textarea
                                    id="organizational_pressures"
                                    value={data.context.organizational_pressures}
                                    onChange={(e) => setData('context', { ...data.context, organizational_pressures: e.target.value })}
                                    placeholder="Deadlines, constraints, limited resources"
                                />
                                {errors['context.organizational_pressures'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['context.organizational_pressures']}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Impact</CardTitle>
                            <CardDescription>Understanding the consequences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="directly_affected">Who was directly affected? How?</Label>
                                <Textarea
                                    id="directly_affected"
                                    value={data.impact.directly_affected}
                                    onChange={(e) => setData('impact', { ...data.impact, directly_affected: e.target.value })}
                                    placeholder="Primary people impacted"
                                />
                                {errors['impact.directly_affected'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['impact.directly_affected']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="indirectly_affected">Who was indirectly affected?</Label>
                                <Textarea
                                    id="indirectly_affected"
                                    value={data.impact.indirectly_affected}
                                    onChange={(e) => setData('impact', { ...data.impact, indirectly_affected: e.target.value })}
                                    placeholder="Observers, teams, communities"
                                />
                                {errors['impact.indirectly_affected'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['impact.indirectly_affected']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="immediate_consequences">What were the immediate consequences?</Label>
                                <Textarea
                                    id="immediate_consequences"
                                    value={data.impact.immediate_consequences}
                                    onChange={(e) => setData('impact', { ...data.impact, immediate_consequences: e.target.value })}
                                    placeholder="What happened right after"
                                />
                                {errors['impact.immediate_consequences'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['impact.immediate_consequences']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="longer_term_consequences">What could the longer-term consequences be?</Label>
                                <Textarea
                                    id="longer_term_consequences"
                                    value={data.impact.longer_term_consequences}
                                    onChange={(e) => setData('impact', { ...data.impact, longer_term_consequences: e.target.value })}
                                    placeholder="Potential future impacts"
                                />
                                {errors['impact.longer_term_consequences'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['impact.longer_term_consequences']}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="impact_significance">
                                    Impact Significance (1-10)
                                </Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    1 = Minimal impact • 10 = Severe, far-reaching impact
                                </p>
                                <Input
                                    id="impact_significance"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={data.impact.impact_significance}
                                    onChange={(e) => setData('impact', { ...data.impact, impact_significance: parseInt(e.target.value) })}
                                />
                                {errors['impact.impact_significance'] && (
                                    <p className="text-sm text-destructive mt-1">{errors['impact.impact_significance']}</p>
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
