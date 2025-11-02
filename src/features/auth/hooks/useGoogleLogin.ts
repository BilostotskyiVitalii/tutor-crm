import { useState } from 'react';

import { endpointsURL } from '@/shared/constants/endpointsUrl';

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const { apiBaseUrl, apiGoogleLogin } = endpointsURL;
  const googleLoginLink = `${apiBaseUrl}${apiGoogleLogin}`;

  const googleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = googleLoginLink;
    }, 300);
  };
  return { googleLogin, loading };
};
