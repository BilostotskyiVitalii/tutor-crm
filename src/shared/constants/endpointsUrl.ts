const baseUrl = `${import.meta.env.VITE_FUNCTIONS_API_BASE}/api` as string;

export const endpointsURL = {
  apiBaseUrl: baseUrl,
  apiLogin: `/auth/login`,
  apiGoogleLogin: `/auth/google`,
  apiRegister: `/auth/register`,
  apiResetPassword: `/auth/register`,
  users: '/users',
  students: '/students',
  lessons: '/lessons',
  groups: '/groups',
} as const;
