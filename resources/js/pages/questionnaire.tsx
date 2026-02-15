import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { QuestionnaireActions } from '@/components/questionnaire/questionnaire-actions';
import { QuestionnaireHero } from '@/components/questionnaire/questionnaire-hero';
import { QuestionCard } from '@/components/questionnaire/question-card';
import { QuestionnaireSidebar } from '@/components/questionnaire/questionnaire-sidebar';
import type { QuestionnaireQuestion } from '@/components/questionnaire/types';
import AppLayout from '@/layouts/app-layout';
import { dashboard, questionnaire as questionnaireRoute } from '@/route-helpers';
import type { BreadcrumbItem } from '@/types';

type QuestionnairePageProps = {
    questions: QuestionnaireQuestion[];
};

const labelMap: Record<string, string> = {
    emotional_mastery: 'Emotional Mastery',
    cognitive_clarity: 'Cognitive Clarity',
    social_relational: 'Social & Relational',
    ethical_moral: 'Ethical & Moral',
    physical_lifestyle: 'Physical & Lifestyle',
    identity_growth: 'Identity & Growth',
};

export default function Questionnaire({ questions }: QuestionnairePageProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = questions.length;
    const currentQuestion = questions[activeIndex];
    const isLastQuestion = total > 0 && activeIndex >= total - 1;
    const completed = useMemo(
        () =>
            questions.filter((question) => answers[question.id] !== undefined)
                .length,
        [answers, questions],
    );

    const sections = useMemo(() => {
        const buckets: Record<
            string,
            { label: string; total: number; completed: number }
        > = {};

        questions.forEach((question) => {
            const displayLabel = labelMap[question.label] ?? question.label;
            if (!buckets[displayLabel]) {
                buckets[displayLabel] = {
                    label: displayLabel,
                    total: 0,
                    completed: 0,
                };
            }

            buckets[displayLabel].total += 1;
            if (answers[question.id] !== undefined) {
                buckets[displayLabel].completed += 1;
            }
        });

        return Object.values(buckets);
    }, [answers, questions]);

    const nextLabel = currentQuestion
        ? labelMap[currentQuestion.label] ?? currentQuestion.label
        : undefined;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Questionnaire',
            href: questionnaireRoute().url,
        },
    ];

    const handleSelect = (value: string | number) => {
        if (!currentQuestion) return;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: Number(value),
        }));
    };

    const handleNext = async () => {
        if (!currentQuestion) return;
        if (isLastQuestion) {
            if (isSubmitting) return;
            setIsSubmitting(true);
            let shouldComplete = false;
            try {
                const csrfToken = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content');
                const xsrfToken = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];
                const response = await fetch('/questionnaire/score', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                        ...(xsrfToken
                            ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }
                            : {}),
                    },
                    body: JSON.stringify({
                        answers,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const labelScores =
                        data?.label_scores ?? data?.labelScores ?? {};
                    const entries = Object.entries(labelScores);
                    if (entries.length) {
                        entries.forEach(([label, score]) => {
                            console.log(`${label}: ${score}`);
                        });
                    } else {
                        console.log('Quiz scores:', data);
                    }
                    shouldComplete = true;
                } else {
                    console.warn(
                        'Failed to fetch quiz scores:',
                        await response.text(),
                    );
                }
            } catch (error) {
                console.error('Failed to fetch quiz scores:', error);
            } finally {
                if (shouldComplete) {
                    router.post('/questionnaire/complete');
                } else {
                    setIsSubmitting(false);
                }
            }
            return;
        }
        setActiveIndex((prev) => Math.min(prev + 1, total - 1));
    };

    const handleBack = () => {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Questionnaire" />
            <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.16),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(13,148,136,0.16),_transparent_40%)]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
                    <QuestionnaireHero
                        current={Math.min(activeIndex + 1, total)}
                        total={total}
                        completed={completed}
                    />

                    {total === 0 ? (
                        <div className="rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-sm">
                            <p className="text-lg font-semibold text-foreground">
                                Questions are not available.
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Please make sure the FastAPI service is running
                                and try again.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="flex flex-col gap-6">
                                {currentQuestion && (
                                    <QuestionCard
                                        question={currentQuestion}
                                        category={
                                            labelMap[currentQuestion.label] ??
                                            currentQuestion.label
                                        }
                                        value={
                                            answers[currentQuestion.id] ?? null
                                        }
                                        onChange={handleSelect}
                                    />
                                )}

                                <QuestionnaireActions
                                    canGoBack={activeIndex > 0}
                                    canGoNext={!!currentQuestion && !isSubmitting}
                                    isLast={isLastQuestion}
                                    onBack={handleBack}
                                    onNext={handleNext}
                                />
                            </div>

                            <QuestionnaireSidebar
                                total={total}
                                completed={completed}
                                nextLabel={nextLabel}
                                sections={sections}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
