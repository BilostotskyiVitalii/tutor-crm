import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, type FormProps, Input } from 'antd';

import { useGoogleLogin } from '@/features/auth/hooks/useGoogleLogin';
import { useLogin } from '@/features/auth/hooks/useLogin';
import type { LoginRequest } from '@/features/auth/types/authTypes';
import { navigationUrls } from '@/shared/constants/navigationUrls';

import styles from './LoginPage.module.scss';

const LoginPage: FC = () => {
  const { login, loading: isLoginLoading } = useLogin();
  const { googleLogin, loading: isGoogleLoading } = useGoogleLogin();
  const { t } = useTranslation();
  const loading = isLoginLoading || isGoogleLoading || false;

  const handleLogin: FormProps<LoginRequest>['onFinish'] = (values) => {
    login(values.email, values.password);
  };

  return (
    <Flex className="auth-backdrop">
      <Form className="auth-form" name="login" onFinish={handleLogin}>
        <h2 className="auth-form-title">{t('login.title')}</h2>

        <Form.Item
          name="email"
          hasFeedback
          rules={[
            { type: 'email', message: `${t('validation.notValidEmail')}` },
            { required: true, message: `${t('validation.noEmail')}` },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('placeholders.email')}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: `${t('validation.noPassword')}` }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder={t('placeholders.password')}
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Link to={navigationUrls.forgotPassword}>
              {t('forgotPassword.title')}?
            </Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Flex className={styles.buttonsWrapper}>
            <Button block type="primary" htmlType="submit" loading={loading}>
              {t('login.button')}
            </Button>
            <Button
              block
              icon={<GoogleOutlined />}
              onClick={googleLogin}
              loading={loading}
            >
              {t('login.googleLogin')}
            </Button>
          </Flex>
          {t('or')}{' '}
          <Link to={navigationUrls.registration}>
            {t('login.registerNow')}!
          </Link>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
