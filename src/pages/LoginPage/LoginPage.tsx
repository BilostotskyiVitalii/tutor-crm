import { Button, Flex, Form, Input, type FormProps } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { navigationUrls } from '@/constants/navigationUrls';
import { setUser } from '@/store/userSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin: FormProps<FieldType>['onFinish'] = ({
    email,
    password,
  }) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const token = await user.getIdToken();
        dispatch(
          setUser({
            id: user.uid,
            email: user.email,
            token: token,
          }),
        );
        navigate(navigationUrls.index);
      })
      .catch(console.error);
  };

  return (
    <section className="auth-backdrop">
      <Form
        className="form"
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        <h2 className="auth-form-title">Login</h2>
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
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <a href="">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          or <Link to={navigationUrls.registration}>Register now!</Link>
        </Form.Item>
      </Form>
    </section>
  );
};

export default LoginPage;
