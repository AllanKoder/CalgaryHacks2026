export const MAIN_CATEGORIES = {
    EMOTIONAL_MASTERY: 'emotional_mastery',
    COGNITIVE_CLARITY: 'cognitive_clarity',
    SOCIAL_RELATIONAL: 'social_relational',
    ETHICAL_MORAL: 'ethical_moral',
    PHYSICAL_LIFESTYLE: 'physical_lifestyle',
    IDENTITY_GROWTH: 'identity_growth',
} as const;

export type MainCategory = typeof MAIN_CATEGORIES[keyof typeof MAIN_CATEGORIES];

export interface SubCategory {
    value: string;
    label: string;
    severity: number;
}

export const MAIN_CATEGORY_LABELS: Record<MainCategory, string> = {
    [MAIN_CATEGORIES.EMOTIONAL_MASTERY]: 'Emotional Mastery',
    [MAIN_CATEGORIES.COGNITIVE_CLARITY]: 'Cognitive Clarity',
    [MAIN_CATEGORIES.SOCIAL_RELATIONAL]: 'Social & Relational',
    [MAIN_CATEGORIES.ETHICAL_MORAL]: 'Ethical & Moral',
    [MAIN_CATEGORIES.PHYSICAL_LIFESTYLE]: 'Physical & Lifestyle',
    [MAIN_CATEGORIES.IDENTITY_GROWTH]: 'Identity & Growth',
};

export const SUBCATEGORIES: Record<MainCategory, SubCategory[]> = {
    [MAIN_CATEGORIES.EMOTIONAL_MASTERY]: [
        { value: 'emotional_awareness', label: 'Emotional Awareness', severity: 3 },
        { value: 'anger_management', label: 'Anger Management', severity: 6 },
        { value: 'anxiety_and_worry', label: 'Anxiety and Worry', severity: 5 },
        { value: 'emotional_suppression', label: 'Emotional Suppression', severity: 5 },
        { value: 'jealousy_and_envy', label: 'Jealousy and Envy', severity: 5 },
        { value: 'emotional_dependency', label: 'Emotional Dependency', severity: 4 },
        { value: 'grief_and_loss_processing', label: 'Grief and Loss Processing', severity: 4 },
        { value: 'frustration_tolerance', label: 'Frustration Tolerance', severity: 4 },
        { value: 'shame_and_guilt_spirals', label: 'Shame and Guilt Spirals', severity: 6 },
        { value: 'mood_volatility', label: 'Mood Volatility', severity: 5 },
        { value: 'grudge_holding_and_unforgiveness', label: 'Grudge Holding and Unforgiveness', severity: 5 },
        { value: 'impulsivity', label: 'Impulsivity', severity: 6 },
    ],
    [MAIN_CATEGORIES.COGNITIVE_CLARITY]: [
        { value: 'confirmation_bias', label: 'Confirmation Bias', severity: 5 },
        { value: 'black_and_white_thinking', label: 'Black and White Thinking', severity: 4 },
        { value: 'catastrophizing', label: 'Catastrophizing', severity: 5 },
        { value: 'overthinking_and_rumination', label: 'Overthinking and Rumination', severity: 4 },
        { value: 'dunning_kruger_overconfidence', label: 'Dunning-Kruger Overconfidence', severity: 5 },
        { value: 'sunk_cost_fallacy', label: 'Sunk Cost Fallacy', severity: 4 },
        { value: 'attribution_errors', label: 'Attribution Errors', severity: 5 },
        { value: 'negativity_bias', label: 'Negativity Bias', severity: 4 },
        { value: 'anchoring_bias', label: 'Anchoring Bias', severity: 3 },
        { value: 'self_serving_bias', label: 'Self-Serving Bias', severity: 5 },
        { value: 'hindsight_bias', label: 'Hindsight Bias', severity: 3 },
        { value: 'bandwagon_effect', label: 'Bandwagon Effect', severity: 4 },
        { value: 'projection', label: 'Projection', severity: 5 },
        { value: 'indecisiveness_and_decision_paralysis', label: 'Indecisiveness and Decision Paralysis', severity: 4 },
    ],
    [MAIN_CATEGORIES.SOCIAL_RELATIONAL]: [
        { value: 'empathy_deficit', label: 'Empathy Deficit', severity: 6 },
        { value: 'poor_communication', label: 'Poor Communication', severity: 4 },
        { value: 'active_listening_failure', label: 'Active Listening Failure', severity: 3 },
        { value: 'conflict_avoidance', label: 'Conflict Avoidance', severity: 4 },
        { value: 'destructive_conflict', label: 'Destructive Conflict', severity: 6 },
        { value: 'boundary_violation', label: 'Boundary Violation', severity: 7 },
        { value: 'inability_to_set_boundaries', label: 'Inability to Set Boundaries', severity: 4 },
        { value: 'people_pleasing', label: 'People Pleasing', severity: 4 },
        { value: 'social_manipulation', label: 'Social Manipulation', severity: 8 },
        { value: 'passive_aggression', label: 'Passive Aggression', severity: 5 },
        { value: 'isolation_and_withdrawal', label: 'Isolation and Withdrawal', severity: 5 },
        { value: 'codependency', label: 'Codependency', severity: 5 },
        { value: 'gossip_and_backbiting', label: 'Gossip and Backbiting', severity: 5 },
        { value: 'bullying_and_intimidation', label: 'Bullying and Intimidation', severity: 7 },
        { value: 'trust_issues_and_suspicion', label: 'Trust Issues and Suspicion', severity: 5 },
    ],
    [MAIN_CATEGORIES.ETHICAL_MORAL]: [
        { value: 'misogyny_gender_disrespect', label: 'Misogyny / Gender Disrespect', severity: 8 },
        { value: 'racism_ethnic_prejudice', label: 'Racism / Ethnic Prejudice', severity: 9 },
        { value: 'homophobia_lgbtq_prejudice', label: 'Homophobia / LGBTQ+ Prejudice', severity: 8 },
        { value: 'religious_cultural_intolerance', label: 'Religious / Cultural Intolerance', severity: 7 },
        { value: 'class_disability_prejudice', label: 'Class / Disability Prejudice', severity: 7 },
        { value: 'dishonesty_and_deception', label: 'Dishonesty and Deception', severity: 7 },
        { value: 'lack_of_accountability', label: 'Lack of Accountability', severity: 6 },
        { value: 'entitlement_and_selfishness', label: 'Entitlement and Selfishness', severity: 6 },
        { value: 'cruelty_and_callousness', label: 'Cruelty and Callousness', severity: 9 },
        { value: 'hypocrisy', label: 'Hypocrisy', severity: 5 },
    ],
    [MAIN_CATEGORIES.PHYSICAL_LIFESTYLE]: [
        { value: 'physical_inactivity', label: 'Physical Inactivity', severity: 4 },
        { value: 'poor_nutrition', label: 'Poor Nutrition', severity: 4 },
        { value: 'sleep_neglect', label: 'Sleep Neglect', severity: 4 },
        { value: 'substance_misuse', label: 'Substance Misuse', severity: 8 },
        { value: 'screen_and_digital_addiction', label: 'Screen and Digital Addiction', severity: 5 },
        { value: 'procrastination', label: 'Procrastination', severity: 4 },
        { value: 'poor_time_management', label: 'Poor Time Management', severity: 3 },
        { value: 'financial_irresponsibility', label: 'Financial Irresponsibility', severity: 5 },
        { value: 'hygiene_and_self_care_neglect', label: 'Hygiene and Self-Care Neglect', severity: 4 },
        { value: 'workaholism', label: 'Workaholism', severity: 5 },
        { value: 'attention_and_focus_deficit', label: 'Attention and Focus Deficit', severity: 4 },
        { value: 'sexual_compulsivity', label: 'Sexual Compulsivity', severity: 6 },
    ],
    [MAIN_CATEGORIES.IDENTITY_GROWTH]: [
        { value: 'low_self_confidence', label: 'Low Self-Confidence', severity: 3 },
        { value: 'low_self_worth', label: 'Low Self-Worth', severity: 5 },
        { value: 'impostor_syndrome', label: 'Impostor Syndrome', severity: 3 },
        { value: 'toxic_perfectionism', label: 'Toxic Perfectionism', severity: 4 },
        { value: 'fear_of_failure', label: 'Fear of Failure', severity: 4 },
        { value: 'fear_of_rejection', label: 'Fear of Rejection', severity: 4 },
        { value: 'lack_of_purpose', label: 'Lack of Purpose', severity: 5 },
        { value: 'victim_mentality', label: 'Victim Mentality', severity: 6 },
        { value: 'fixed_mindset', label: 'Fixed Mindset', severity: 5 },
        { value: 'learned_helplessness', label: 'Learned Helplessness', severity: 5 },
        { value: 'complacency', label: 'Complacency', severity: 3 },
        { value: 'identity_fragility', label: 'Identity Fragility', severity: 4 },
        { value: 'inability_to_ask_for_help', label: 'Inability to Ask for Help', severity: 4 },
        { value: 'materialism_and_status_obsession', label: 'Materialism and Status Obsession', severity: 5 },
        { value: 'spiritual_existential_disconnection', label: 'Spiritual / Existential Disconnection', severity: 4 },
    ],
};

export function getSubcategoriesForMain(mainCategory: MainCategory | string): SubCategory[] {
    return SUBCATEGORIES[mainCategory as MainCategory] || [];
}

export function getSeverityForSubcategory(mainCategory: MainCategory | string, subCategory: string): number | null {
    const subcategories = getSubcategoriesForMain(mainCategory);
    const found = subcategories.find(sub => sub.value === subCategory);
    return found?.severity ?? null;
}
