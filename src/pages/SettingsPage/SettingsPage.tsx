import { useEffect, useState } from 'react';

import { Button, Form, Spin } from 'antd';
import { App as AntApp } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

import { useFetchProfileQuery } from '@/features/auth/api/authApi';
import { useUserActions } from '@/features/user/useUserActions';
import AvatarUploader from '@/shared/components/UI/AvatarUploader/AvatarUploader';
import { useUploadAvatar } from '@/shared/hooks/useUploadAvatar';

const SettingsPage = () => {
  const { data: user } = useFetchProfileQuery();
  const { uploadAvatar } = useUploadAvatar();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const { updateUserData } = useUserActions();
  const { notification, modal, message } = AntApp.useApp();

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
  }, [user]);

  const handleSave = async () => {
    if (fileList.length === 0) {
      message.warning('Будь ласка, оберіть аватар перед збереженням.');
      return;
    }

    const file = fileList[0].originFileObj as File | undefined;
    if (!file) {
      notification.error({ message: 'File not found' });
      return;
    }

    setLoading(true);
    try {
      if (!user?.id) {
        return;
      }
      const downloadUrl = await uploadAvatar(file, user?.id || '', avatarUrl);
      updateUserData({ avatar: downloadUrl });
      setAvatarUrl(downloadUrl);
      notification.success({ message: 'Avatar updated!' });
    } catch {
      notification.error({ message: 'Avatar wasn`t updated!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form layout="vertical" style={{ maxWidth: 300 }}>
        <h2>Налаштування профілю</h2>
        <AvatarUploader fileList={fileList} setFileList={setFileList} />
        <Form.Item>
          <Button type="primary" onClick={handleSave}>
            Зберегти аватар
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SettingsPage;
