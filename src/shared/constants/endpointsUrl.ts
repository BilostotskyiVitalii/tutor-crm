export const endpointsURL = {
  apiBaseUrl: `${import.meta.env.VITE_FUNCTIONS_API_BASE}/api` as string,
  users: '/users',
  students: '/students',
  lessons: '/lessons',
  groups: '/groups',
} as const;
