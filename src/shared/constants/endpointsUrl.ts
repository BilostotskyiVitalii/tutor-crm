const baseUrl = `${import.meta.env.VITE_FUNCTIONS_API_BASE}/api` as string;

export const endpointsURL = {
  apiBaseUrl: baseUrl,
  apiLogin: `/auth/login`,
  apiGoogleLogin: `/auth/google/url`,
  apiRegister: `/auth/register`,
  apiResetPassword: `/auth/reset`,
  apiConfirmPassword: `/auth/reset/confirm`,
  apiProfile: `/auth/profile`,
  apiLogout: `/auth/logout`,
  apiUploadInit: '/uploads/avatars/initiate',
  apiUploadfinal: '/uploads/avatars/finalize',
  students: '/students',
  lessons: '/lessons',
  groups: '/groups',
  dashboardStats: '/dashboard/stats',
  user: '/user',
} as const;
