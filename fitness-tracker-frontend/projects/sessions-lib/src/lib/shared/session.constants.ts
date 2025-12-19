export const MAX_ORDER_VALUE = 30;

export const MIN_NAME_LENGTH = 2;

export const ERROR_MESSAGES = {
    SESSION_NOT_FOUND: 'Session not found. It may have been deleted.',
    DUPLICATE_SESSION: 'A session with this position already exists in this plan.',
    INVALID_SESSION_DATA: 'Invalid session data. Please check all fields.',
    SESSION_NAME_REQUIRED: 'Session name is required',
    PLAN_REQUIRED: 'Plan is required',
    DUPLICATE_EXERCISE: 'Each exercise can only be added once to the session',
    SETS_REQUIRED: 'Sets must be greater than 0',
    REPS_REQUIRED: 'Reps must be greater than 0',
    WEIGHT_INVALID: 'Weight must be 0 or greater',
    WEIGHT_REQUIRED: 'Weight must be greater than 0 for this exercise',
    FAILED_LOAD_PLANS: 'Failed to load plans',
    FAILED_LOAD_EXERCISES: 'Failed to load exercises',
} as const;
