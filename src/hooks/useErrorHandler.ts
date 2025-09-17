import { notification } from 'antd';
import { FirebaseError } from 'firebase/app';
import { firebaseErrorMap } from '@/constants/errors';

export const useErrorHandler = () => {
  const handleError = (err: unknown, context?: string) => {
    let errMessage = 'Неизвестная ошибка';

    if (err instanceof FirebaseError) {
      errMessage = firebaseErrorMap[err.code] ?? err.message;
    } else if (err instanceof Error) {
      errMessage = err.message;
    }

    notification.error({
      message: context || 'Ошибка',
      description: errMessage,
      duration: 4,
      pauseOnHover: true,
      showProgress: true,
    });

    return errMessage;
  };

  return { handleError };
};
