import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, type FormProps, Input } from 'antd';

import { useRegister } from '@/features/auth/hooks/useRegister';
import type { RegisterRequest } from '@/features/auth/types/authTypes';
import { navigationUrls } from '@/shared/constants/navigationUrls';

const RegistrationPage: FC = () => {
  const { register, loading } = useRegister();
  const { t } = useTranslation();

  const handleRegister: FormProps<RegisterRequest>['onFinish'] = async (
    values,
  ) => {
    const { email, password, nickName } = values;
    await register(email, password, nickName);
  };

  return (
    <Flex className="auth-backdrop">
      <Form name="register" onFinish={handleRegister} className="auth-form">
        <h2 className="auth-form-title">{t('registration.title')}</h2>

        <Form.Item
          name="nickName"
          hasFeedback
          rules={[
            {
              required: true,
              message: `${t('registration.noNickname')}`,
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nickname" />
        </Form.Item>

        <Form.Item
          name="email"
          hasFeedback
          rules={[
            { type: 'email', message: `${t('registration.notValidEmail')}` },
            { required: true, message: `${t('registration.noEmail')}` },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('placeholders.email')}
          />
        </Form.Item>

        <Form.Item
          name="password"
          hasFeedback
          rules={[
            { required: true, message: `${t('registration.noPassword')}` },
            { min: 6, message: `${t('registration.passLenght')}` },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder={t('placeholders.password')}
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: `${t('validation.confirmPass')}` },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(`${t('validation.notMatchPass')}`),
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('placeholders.confirmPass')}
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            {t('registration.button')}
          </Button>
          {t('or')}{' '}
          <Link to={navigationUrls.login}>{t('registration.loginNow')}!</Link>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default RegistrationPage;
