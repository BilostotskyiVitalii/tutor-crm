import { Button, Form, Input, type FormProps } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { navigationUrls } from '@/constants/navigationUrls';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, serverTimestamp } from 'firebase/database';

type FieldType = {
  email: string;
  password: string;
  nickName: string;
};

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const db = getDatabase();
  const auth = getAuth();

  const handleRegister: FormProps<FieldType>['onFinish'] = async ({
    email,
    password,
    nickName,
  }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await set(ref(db, 'users/' + user.uid), {
        nickName: nickName ?? '',
        email: user.email,
        createdAt: serverTimestamp(),
      });

      navigate(navigationUrls.index);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <section className="auth-backdrop">
      <Form
        name="register"
        onFinish={handleRegister}
        className="form"
        scrollToFirstError
      >
        <h2 className="auth-form-title">Registration</h2>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-mail" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item
          name="nickName"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nickname" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
          or <Link to={navigationUrls.login}>Login now!</Link>
        </Form.Item>
      </Form>
    </section>
  );
};

export default RegistrationPage;
