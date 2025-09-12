import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { navigationUrls } from '@/constants/navigationUrls';

const LoginPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  function onRegHandler(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    navigate(navigationUrls.registration);
  }

  return (
    <section className="auth-backdrop">
      <Form
        className="form"
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h2 className="auth-form-title">Login</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
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
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          or{' '}
          <a href="" onClick={onRegHandler}>
            Register now!
          </a>
        </Form.Item>
      </Form>
    </section>
  );
};

export default LoginPage;
