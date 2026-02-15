export type QuestionnaireOption = {
    text: string;
    score?: number;
};

export type QuestionnaireQuestion = {
    id: string;
    label: string;
    type: 'scenario' | 'agree_disagree' | 'self_rating';
    text: string;
    options?: QuestionnaireOption[] | null;
    inverted?: boolean;
};
