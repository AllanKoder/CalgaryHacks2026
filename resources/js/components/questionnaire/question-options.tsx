import { cn } from '@/lib/utils';

type QuestionOption = {
    label: string;
    value: string | number;
    helper?: string;
};

type QuestionOptionsProps = {
    options: QuestionOption[];
    value: string | number | null;
    onChange: (value: string | number) => void;
};

export function QuestionOptions({
    options,
    value,
    onChange,
}: QuestionOptionsProps) {
    return (
        <div className="grid gap-3">
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.label}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'group rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/80 hover:shadow-md',
                            isActive &&
                                'border-primary/60 bg-primary/10 shadow-sm ring-1 ring-primary/20',
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {option.label}
                                </p>
                                {option.helper && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {option.helper}
                                    </p>
                                )}
                            </div>
                            <div
                                className={cn(
                                    'mt-1 size-2.5 rounded-full border border-muted-foreground/40',
                                    isActive &&
                                        'border-primary bg-primary shadow-[0_0_0_4px_rgba(20,184,166,0.12)]',
                                )}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
