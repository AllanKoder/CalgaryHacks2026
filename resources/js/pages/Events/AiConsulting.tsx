import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
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

interface AnalysisSummary {
    overall_assessment: string;
    key_insights: string[];
    primary_concerns: string[];
    strengths_identified: string[];
    recommended_focus: string;
}

interface Analysis {
    summary: AnalysisSummary;
}

interface Props {
    event: Event;
    question: string;
}

type Step = 'input' | 'loading_question' | 'answer' | 'loading_analysis' | 'results';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: eventsIndex().url },
    { title: 'AI Consulting', href: '#' },
];

export default function AiConsulting({ event, question }: Props) {
    const [step, setStep] = useState<Step>('input');
    const [userInput, setUserInput] = useState('');
    const [aiQuestion, setAiQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [conversationState, setConversationState] = useState<Record<string, unknown> | null>(null);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const displayDate = event.occurred_at ?? event.created_at;

    async function handleStartDiagnostic(e: React.FormEvent) {
        e.preventDefault();
        if (!userInput.trim()) return;

        setStep('loading_question');
        setError(null);

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            const xsrfToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            const resp = await fetch(`/events/${event.id}/diagnostic/start`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                    ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
                },
                body: JSON.stringify({ user_input: userInput }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || 'Failed to generate question');
            }

            setAiQuestion(data.question);
            setConversationState(data.state);
            setStep('answer');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setStep('input');
        }
    }

    async function handleSubmitAnswer(e: React.FormEvent) {
        e.preventDefault();
        if (!userAnswer.trim() || !conversationState) return;

        setStep('loading_analysis');
        setError(null);

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            const xsrfToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            const resp = await fetch(`/events/${event.id}/diagnostic/answer`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                    ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
                },
                body: JSON.stringify({
                    state: conversationState,
                    answer: userAnswer,
                }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || 'Failed to analyze');
            }

            if (data.is_complete && data.analysis) {
                setAnalysis({ summary: data.analysis.summary });
                setStep('results');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setStep('answer');
        }
    }

    function handleReset() {
        setStep('input');
        setUserInput('');
        setAiQuestion('');
        setUserAnswer('');
        setConversationState(null);
        setAnalysis(null);
        setError(null);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Consulting Model" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="w-fit">AI Consulting</Badge>
                    <h1 className="text-3xl font-bold">AI Consulting Model</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Take a quiet moment to reflect and share what's on your mind.
                    </p>
                </div>

                {/* Context card */}
                <Card className="border-border/60">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reflection Context</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{event.title || 'Reflection'}</Badge>
                            <Badge variant="outline">
                                {displayDate ? new Date(displayDate).toLocaleDateString() : 'N/A'}
                            </Badge>
                            <Badge variant="outline">Severity {event.emotional_severity}/5</Badge>
                            {event.focus && <Badge variant="outline">{event.focus}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </CardContent>
                </Card>

                {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {/* Step 1: User input */}
                {step === 'input' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Share What's On Your Mind</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleStartDiagnostic} className="space-y-4">
                                <Textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="I've been struggling with..."
                                    className="min-h-[180px]"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={userInput.trim().length === 0}
                                    >
                                        Get AI Question
                                    </Button>
                                    <Link href={eventsShow(event.id).url}>
                                        <Button type="button" variant="outline">
                                            Back to Reflection
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Loading question */}
                {step === 'loading_question' && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">AI is preparing a question for you...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Answer AI question */}
                {step === 'answer' && (
                    <Card>
                        <CardHeader className="space-y-4">
                            <div>
                                <CardTitle>Step 2: Respond to the AI's Question</CardTitle>
                                <CardDescription>Take your time to reflect and answer thoughtfully.</CardDescription>
                            </div>

                            {/* Show user's input */}
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">You shared</p>
                                <p className="text-sm">{userInput}</p>
                            </div>

                            {/* Show AI question */}
                            <div className="rounded-xl border bg-background/80 p-4 text-base font-semibold leading-relaxed">
                                {aiQuestion}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitAnswer} className="space-y-4">
                                <Textarea
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Your response..."
                                    className="min-h-[180px]"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={userAnswer.trim().length === 0}
                                    >
                                        Submit for Analysis
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleReset}>
                                        Start Over
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Loading analysis */}
                {step === 'loading_analysis' && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">AI is analyzing your responses and updating your metrics...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Results (summary only — scores update silently on the dashboard) */}
                {step === 'results' && analysis && (
                    <>
                        {/* Overall assessment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Analysis Complete</CardTitle>
                                <CardDescription>Your dashboard charts have been updated with the latest insights.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm leading-relaxed">
                                    {analysis.summary.overall_assessment}
                                </p>

                                {analysis.summary.recommended_focus && (
                                    <div className="rounded-lg border bg-primary/5 p-4">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Recommended Focus</p>
                                        <p className="text-sm font-medium">{analysis.summary.recommended_focus}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Insights */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {analysis.summary.key_insights?.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Key Insights</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {analysis.summary.key_insights.map((insight, i) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-muted-foreground shrink-0">-</span>
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="space-y-6">
                                {analysis.summary.primary_concerns?.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Primary Concerns</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {analysis.summary.primary_concerns.map((concern, i) => (
                                                    <li key={i} className="flex gap-2 text-sm">
                                                        <span className="text-muted-foreground shrink-0">-</span>
                                                        {concern}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                {analysis.summary.strengths_identified?.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Strengths Identified</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {analysis.summary.strengths_identified.map((strength, i) => (
                                                    <li key={i} className="flex gap-2 text-sm">
                                                        <span className="text-muted-foreground shrink-0">-</span>
                                                        {strength}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button onClick={handleReset} variant="outline">
                                Run Another Analysis
                            </Button>
                            <Link href={eventsShow(event.id).url}>
                                <Button variant="outline">
                                    Back to Reflection
                                </Button>
                            </Link>
                            <Link href={dashboard().url}>
                                <Button>
                                    View Updated Dashboard
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
