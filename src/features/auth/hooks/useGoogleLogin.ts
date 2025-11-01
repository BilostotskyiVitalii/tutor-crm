import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const useGoogleLogin = () => {
  const googleLogin = () => {
    window.location.href = `${endpointsURL.apiBaseUrl}/auth/google/url`;
  };
  return { googleLogin, loading: false, error: null };
};
