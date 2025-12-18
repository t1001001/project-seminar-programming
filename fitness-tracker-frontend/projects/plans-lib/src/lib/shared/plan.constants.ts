export const ERROR_MESSAGES = {
    PLAN_NOT_FOUND: 'Training plan not found. It may have been deleted.',
    PLAN_DELETED: 'Training plan not found. It may have been already deleted.',
    PLAN_CONFLICT: 'Training plan with this name already exists',
    FAILED_CREATE: 'Failed to create training plan',
    FAILED_LOAD: 'Failed to load training plan details',
    FAILED_LOAD_ALL: 'Failed to load training plans',
    FAILED_UPDATE: 'Failed to update training plan',
    FAILED_DELETE: 'Failed to delete training plan',
    INVALID_DATA: 'Invalid training plan data. Please check all required fields.',
} as const;
