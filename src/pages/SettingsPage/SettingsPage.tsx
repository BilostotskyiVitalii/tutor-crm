import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Form, Input, Spin } from 'antd';
import { App as AntApp } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

import { useFetchProfileQuery } from '@/features/auth/api/authApi';
import type { UserUpdates } from '@/features/user/types/userTypes';
import { useUserActions } from '@/features/user/useUserActions';
import AvatarUploader from '@/shared/components/UI/AvatarUploader/AvatarUploader';
import { useUploadAvatar } from '@/shared/hooks/useUploadAvatar';

const SettingsPage = () => {
  const { data: user } = useFetchProfileQuery();
  const { uploadAvatar } = useUploadAvatar();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [nickName, setNickName] = useState(user?.nickName || '');
  const { updateUserData } = useUserActions();
  const { notification } = AntApp.useApp();
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.avatar) {
      setFileList([
        {
          uid: '-1',
          name: 'current-avatar.jpg',
          status: 'done',
          url: user?.avatar,
        },
      ]);
    }
    if (user?.nickName) {
      setNickName(user.nickName);
    }
  }, [user]);

  const handleSave = async () => {
    if (fileList.length === 0 && !nickName) {
      notification.warning({
        message: `${t('settings.noChanges')}`,
      });
      return;
    }

    setLoading(true);

    try {
      const updates: Partial<UserUpdates> = {};

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as File | undefined;
        if (file) {
          const downloadUrl = await uploadAvatar(
            file,
            user?.id || '',
            avatarUrl,
          );
          updates.avatar = downloadUrl;
          setAvatarUrl(downloadUrl);
        }
      }

      if (nickName !== user?.nickName) {
        updates.nickName = nickName;
      }

      if (Object.keys(updates).length > 0) {
        await updateUserData(updates);
        notification.success({ message: `${t('settings.profileUpdated')}` });
      }
    } catch {
      notification.error({ message: `${t('settings.profileUpdFailed')}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form layout="vertical" style={{ maxWidth: 400 }}>
        <h2>{t('settings.title')}</h2>

        <Form.Item label={t('settings.button')}>
          <Input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        </Form.Item>

        <AvatarUploader fileList={fileList} setFileList={setFileList} />

        <Form.Item>
          <Button type="primary" onClick={handleSave}>
            {t('settings.button')}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SettingsPage;
