import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuestionnaireActionsProps = {
    canGoBack: boolean;
    canGoNext: boolean;
    onBack: () => void;
    onNext: () => void;
};

export function QuestionnaireActions({
    canGoBack,
    canGoNext,
    onBack,
    onNext,
}: QuestionnaireActionsProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button
                variant="outline"
                onClick={onBack}
                disabled={!canGoBack}
                className="bg-white/70"
            >
                <ArrowLeft className="size-4" />
                Previous
            </Button>
            <Button onClick={onNext} disabled={!canGoNext}>
                Next
                <ArrowRight className="size-4" />
            </Button>
        </div>
    );
}
