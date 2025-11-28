import React from 'react';
import { Button, Card, Form, Input, Typography, Row, Col, Checkbox } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useLogin } from '~/hook/useAuth.ts';
import {showMessage} from "~/util/msg";

const { Title, Paragraph } = Typography;
const { Item } = Form;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<{username: string; password: string}>();
  const { login, isLoading } = useLogin();

  const onFinish = async (values: {username: string; password: string}) => {
    const res = await login(values.username, values.password);
    if (res.success) {
      showMessage.success('登录成功！');
      navigate('/');
    } else { 
      showMessage.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="cream-bg">
      <Row justify="center" align="middle" className="cream-row">
        <Col xs={22} xl={24}>
          <Card className="cream-card cream-fade-in" bordered={false} style={{ borderRadius: '12px' }}>
            <div className="cream-header">
              <Title level={3} className="cream-title">Witstalk</Title>
              <Paragraph className="cream-subtitle">欢迎回来，请登录您的账户</Paragraph>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="cream-form"
            >
              <Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { 
                    pattern: /^[a-zA-Z0-9_]{3,20}$/, 
                    message: '用户名只能包含字母、数字和下划线，长度3-20位'
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  className="cream-input"
                  style={{ height: '40px' }}
                />
              </Item>
              
              <Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { 
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/, 
                    message: '密码至少6位，必须包含字母和数字'
                  }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  className="cream-input"
                  style={{ height: '40px' }}
                />
              </Item>
              
              <Item name="remember" valuePropName="checked">
                <Checkbox>记住我</Checkbox>
                <Button type="text" className="cream-link">忘记密码？</Button>
              </Item>
              
              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="cream-button"
                  loading={isLoading}
                  block
                  style={{ height: '40px' }}
                >
                  登录
                </Button>
              </Item>
              
              <div className="text-center mt-4">
                <span>还没有账号？</span>
                <Button type="link" onClick={() => navigate('/register')}>立即注册</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;