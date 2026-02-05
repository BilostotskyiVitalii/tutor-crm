import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { App as AntApp } from 'antd';

import { useUpdateUserMutation } from '@/features/user/api/userApi';
import type { UserUpdates } from '@/features/user/types/userTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export function useUserActions() {
  const [updateUser] = useUpdateUserMutation();
  const { handleError } = useErrorHandler();
  const { notification } = AntApp.useApp();
  const { t } = useTranslation();

  const updateUserData = useCallback(
    async (data: Partial<UserUpdates>) => {
      try {
        await updateUser(data).unwrap();
        notification.success({ message: `${t('useUserAction.updated')}` });
      } catch (err) {
        handleError(err, `${t('useUserAction.updateFailed')}`);
      }
    },
    [updateUser, handleError, notification, t],
  );

  return {
    updateUserData,
  };
}
