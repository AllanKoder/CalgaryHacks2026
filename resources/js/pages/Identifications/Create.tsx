import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import { index as eventsIndex } from '@/routes/events';
import { store as eventsIdentificationStore } from '@/routes/events/identification';
import { MAIN_CATEGORIES, MAIN_CATEGORY_LABELS, getSubcategoriesForMain, type MainCategory } from '@/lib/categories';
import { useState } from 'react';

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
    { title: 'Add Identification', href: '#' },
];

export default function Create({ event }: Props) {
    const [availableSubcategories, setAvailableSubcategories] = useState<Array<{value: string, label: string, severity: number}>>([]);

    const { data, setData, post, processing, errors } = useForm({
        tag: '',
        main_category: '',
        sub_category: '',
        assumptions: {
            what_assumptions: '',
            ignored_information: '',
            protected_beliefs: '',
        },
        pattern_recognition: {
            noticed_before: '',
            triggers: '',
            personal_or_organizational: '',
            common_thread: '',
        },
    });

    const handleMainCategoryChange = (value: string) => {
        setData('main_category', value);
        setData('sub_category', ''); // Reset subcategory when main category changes
        setAvailableSubcategories(getSubcategoriesForMain(value as MainCategory));
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(eventsIdentificationStore(event.id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Identification" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Add Identification</h1>
                <p className="text-muted-foreground">Event: {event.description}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Identification</CardTitle>
                            <CardDescription>Categorize the mental aspect of this event</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="main_category">Main Category *</Label>
                                <Select value={data.main_category} onValueChange={handleMainCategoryChange}>
                                    <SelectTrigger id="main_category">
                                        <SelectValue placeholder="Select a main category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(MAIN_CATEGORIES).map(([key, value]) => (
                                            <SelectItem key={value} value={value}>
                                                {MAIN_CATEGORY_LABELS[value]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.main_category && (
                                    <p className="text-sm text-destructive mt-1">{errors.main_category}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="sub_category">Sub Category *</Label>
                                <Select
                                    value={data.sub_category}
                                    onValueChange={(value) => setData('sub_category', value)}
                                    disabled={!data.main_category}
                                >
                                    <SelectTrigger id="sub_category">
                                        <SelectValue placeholder={data.main_category ? "Select a sub-category" : "Select main category first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSubcategories.map((sub) => (
                                            <SelectItem key={sub.value} value={sub.value}>
                                                {sub.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sub_category && (
                                    <p className="text-sm text-destructive mt-1">{errors.sub_category}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Self-Awareness</CardTitle>
                            <CardDescription>Examine your assumptions and blind spots</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="what_assumptions">What assumptions did you make? (List them explicitly)</Label>
                                <Textarea
                                    id="what_assumptions"
                                    value={data.assumptions.what_assumptions}
                                    onChange={(e) => setData('assumptions', { ...data.assumptions, what_assumptions: e.target.value })}
                                    placeholder="List the assumptions you made during this event..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ignored_information">What information did you ignore or not seek out?</Label>
                                <Textarea
                                    id="ignored_information"
                                    value={data.assumptions.ignored_information}
                                    onChange={(e) => setData('assumptions', { ...data.assumptions, ignored_information: e.target.value })}
                                    placeholder="What information or perspectives did you overlook..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="protected_beliefs">What beliefs or values were you protecting?</Label>
                                <Textarea
                                    id="protected_beliefs"
                                    value={data.assumptions.protected_beliefs}
                                    onChange={(e) => setData('assumptions', { ...data.assumptions, protected_beliefs: e.target.value })}
                                    placeholder="What beliefs or values influenced your behavior..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pattern Recognition</CardTitle>
                            <CardDescription>Identify recurring patterns and triggers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="noticed_before">Have you noticed this bias before? When?</Label>
                                <Textarea
                                    id="noticed_before"
                                    value={data.pattern_recognition.noticed_before}
                                    onChange={(e) => setData('pattern_recognition', { ...data.pattern_recognition, noticed_before: e.target.value })}
                                    placeholder="Describe when you've seen this pattern before..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="triggers">What triggers this bias for you? (situations, people, topics, emotions)</Label>
                                <Textarea
                                    id="triggers"
                                    value={data.pattern_recognition.triggers}
                                    onChange={(e) => setData('pattern_recognition', { ...data.pattern_recognition, triggers: e.target.value })}
                                    placeholder="List the triggers that activate this pattern..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="personal_or_organizational">Is this personal or does it reflect organizational patterns?</Label>
                                <Textarea
                                    id="personal_or_organizational"
                                    value={data.pattern_recognition.personal_or_organizational}
                                    onChange={(e) => setData('pattern_recognition', { ...data.pattern_recognition, personal_or_organizational: e.target.value })}
                                    placeholder="Is this your individual pattern or part of a larger system..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="common_thread">What's the common thread across incidents?</Label>
                                <Textarea
                                    id="common_thread"
                                    value={data.pattern_recognition.common_thread}
                                    onChange={(e) => setData('pattern_recognition', { ...data.pattern_recognition, common_thread: e.target.value })}
                                    placeholder="What connects all these incidents together..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Save Identification
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
