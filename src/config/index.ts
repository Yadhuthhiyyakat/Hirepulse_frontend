export const APP_CONFIG = {
  NAME: 'HirePulse',
  DESCRIPTION: 'Full-Stack Recruitment Management Platform',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 20,
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  WS_BASE_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/notifications',
  ROLES: {
    JOB_SEEKER: 'JOB_SEEKER',
    RECRUITER: 'RECRUITER',
    ADMIN: 'ADMIN',
  },
} as const;

