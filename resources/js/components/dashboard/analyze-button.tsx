import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { create as eventsCreate } from '@/routes/events';

type AnalyzeButtonProps = {
    label?: string;
    className?: string;
};

export function AnalyzeButton({
    label = 'New Reflection',
    className,
}: AnalyzeButtonProps) {
    return (
<<<<<<< Updated upstream
        <Link href={eventsCreate().url}>
            <Button
                className={cn(
                    'shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5',
                    className,
                )}
            >
                {label}
            </Button>
        </Link>
=======
        <Button
            className={cn(
                'shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5',
                className,
            )}
        >
            {label}
        </Button>
>>>>>>> Stashed changes
    );
}
