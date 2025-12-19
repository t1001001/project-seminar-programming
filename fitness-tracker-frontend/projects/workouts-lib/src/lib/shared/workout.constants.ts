export const ERROR_MESSAGES = {
    WORKOUT_NOT_FOUND: 'Workout log not found.',
    WORKOUT_DELETED: 'Workout log not found. It may have been already deleted.',
    FAILED_START: 'Failed to start workout',
    FAILED_LOAD: 'Failed to load workout log',
    FAILED_SAVE: 'Failed to save workout',
    FAILED_CANCEL: 'Failed to cancel workout',
    FAILED_DELETE: 'Failed to delete workout log',
    FAILED_LOAD_ALL: 'Failed to load workout logs',
    SESSION_NOT_FOUND: 'Workout session not found. It may have been deleted.',
    NO_EXERCISES: 'Cannot start workout: Session must contain at least one exercise.',
    INVALID_DATA: 'Invalid workout data. Please check all fields.',
} as const;
