import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuestionnaireActionsProps = {
    canGoBack: boolean;
    canGoNext: boolean;
    isLast?: boolean;
    onBack: () => void;
    onNext: () => void;
};

export function QuestionnaireActions({
    canGoBack,
    canGoNext,
    isLast = false,
    onBack,
    onNext,
}: QuestionnaireActionsProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <Button
                variant="outline"
                onClick={onBack}
                disabled={!canGoBack}
                className="w-full bg-white/70"
            >
                <ArrowLeft className="size-4" />
                Previous
            </Button>
            <Button onClick={onNext} disabled={!canGoNext} className="w-full">
                {isLast ? 'Finish' : 'Next'}
                <ArrowRight className="size-4" />
            </Button>
        </div>
    );
}
