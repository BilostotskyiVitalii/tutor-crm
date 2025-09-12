import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { navigationUrls } from '@/constants/navigationUrls';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  function onLoginHandler(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    navigate(navigationUrls.login);
  }

  return (
    <section className="auth-backdrop">
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
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
          name="nickname"
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
          or{' '}
          <a href="" onClick={onLoginHandler}>
            Log in!
          </a>
        </Form.Item>
      </Form>
    </section>
  );
};

export default RegistrationPage;
