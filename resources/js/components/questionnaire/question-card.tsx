import { Badge } from '@/components/ui/badge';
import { QuestionOptions } from '@/components/questionnaire/question-options';
import type { QuestionnaireQuestion } from '@/components/questionnaire/types';

type QuestionCardProps = {
    question: QuestionnaireQuestion;
    category: string;
    value: string | number | null;
    onChange: (value: string | number) => void;
};

const agreeDisagreeOptions = [
    {
        label: 'Strongly disagree',
        value: 1,
        helper: 'Not true for me',
    },
    {
        label: 'Disagree',
        value: 2,
    },
    {
        label: 'Neutral',
        value: 3,
    },
    {
        label: 'Agree',
        value: 4,
    },
    {
        label: 'Strongly agree',
        value: 5,
        helper: 'Very true for me',
    },
];

const selfRatingOptions = [
    { label: '1', value: 1, helper: 'Rarely' },
    { label: '2', value: 2 },
    { label: '3', value: 3, helper: 'Sometimes' },
    { label: '4', value: 4 },
    { label: '5', value: 5, helper: 'Consistently' },
];

const questionTypeLabel = (question: QuestionnaireQuestion) => {
    if (question.type === 'scenario') return 'Scenario';
    if (question.type === 'agree_disagree') return 'Agreement';
    return 'Self rating';
};

export function QuestionCard({
    question,
    category,
    value,
    onChange,
}: QuestionCardProps) {
    const options =
        question.type === 'scenario'
            ? (question.options ?? []).map((option) => ({
                  label: option.text,
                  value: option.text,
              }))
            : question.type === 'agree_disagree'
              ? agreeDisagreeOptions
              : selfRatingOptions;

    return (
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
                <Badge
                    variant="secondary"
                    className="rounded-full bg-secondary/80 px-3 py-1 text-[11px]"
                >
                    {category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                    {questionTypeLabel(question)}
                </span>
                {question.inverted && (
                    <span className="text-xs text-muted-foreground">
                        Reverse scored
                    </span>
                )}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground md:text-2xl">
                {question.text}
            </h2>

            <div className="mt-5">
                <QuestionOptions
                    options={options}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
