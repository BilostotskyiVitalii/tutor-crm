export const endpointsURL = {
  apiBaseUrl: import.meta.env.VITE_FUNCTIONS_API_BASE as string,
  users: '/users',
  students: '/students',
  lessons: '/lessons',
  groups: '/groups',
} as const;
