import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AnalyzeButtonProps = {
    label?: string;
    className?: string;
};

export function AnalyzeButton({
    label = 'Analyse a new claim',
    className,
}: AnalyzeButtonProps) {
    return (
        <Button
            className={cn(
                'shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5',
                className,
            )}
        >
            <Sparkles className="size-4" />
            {label}
        </Button>
    );
}
