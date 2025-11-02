const baseUrl = `${import.meta.env.VITE_FUNCTIONS_API_BASE}/api` as string;

export const endpointsURL = {
  apiBaseUrl: baseUrl,
  apiLogin: `/auth/login`,
  apiGoogleLogin: `/auth/google/url`,
  apiRegister: `/auth/register`,
  apiResetPassword: `/auth/reset`,
  apiProfile: `/auth/profile`,
  apiLogout: `/auth/logout`,
  students: '/students',
  lessons: '/lessons',
  groups: '/groups',
} as const;
