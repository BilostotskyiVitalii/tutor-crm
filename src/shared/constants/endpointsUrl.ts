const baseUrl = `${import.meta.env.VITE_FUNCTIONS_API_BASE}/api` as string;

export const endpointsURL = {
  apiBaseUrl: baseUrl,
  apiLogin: `/auth/login`,
  apiGoogleLogin: `/auth/google`,
  apiRegister: `/auth/register`,
  // reset ????
  apiResetPassword: `/auth/register`,
  apiProfile: `/auth/profile`,
  apiLogout: `/auth/logout`,
  students: '/students',
  lessons: '/lessons',
  groups: '/groups',
} as const;
