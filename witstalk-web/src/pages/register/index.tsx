import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { showMessage } from "~/util/msg";
import { register } from "~/api/user";

const { Title, Paragraph } = Typography;
const { Item } = Form;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<{username: string; password: string; confirmPassword: string; nickname: string; email: string}>();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: {username: string; password: string; confirmPassword: string; nickname: string; email: string}) => {
    const { username, password, nickname, email } = values;
    try {
      setIsLoading(true);
      await register(username, password, nickname, email);
      setIsLoading(false);
      showMessage.success('注册成功，请登录');
      navigate('/login');
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      showMessage.error('注册失败，请检查输入信息');
    }
  };

  return (
    <div className="cream-bg">
      <Row justify="center" align="middle"  className="cream-row">
        <Col xs={22} xl={24}>
          <Card className="cream-card cream-fade-in" bordered={false} style={{ borderRadius: '12px' }}>
            <div className="cream-header">
              <Title level={3} className="cream-title">Witstalk</Title>
              <Paragraph className="cream-subtitle">创建新账户，开始使用</Paragraph>
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
              
              <Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                  {
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/,
                    message: '密码至少6位，必须包含字母和数字'
                  }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                  className="cream-input"
                  style={{ height: '40px' }}
                />
              </Item>
              
              <Item
                name="nickname"
                label="昵称"
                rules={[
                  { required: true, message: '请输入昵称' },
                  { 
                    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/, 
                    message: '昵称只能包含中文、字母、数字和下划线，长度2-20位'
                  }
                ]}
              >
                <Input
                  prefix={<ProfileOutlined />}
                  placeholder="请输入昵称"
                  className="cream-input"
                  style={{ height: '40px' }}
                />
              </Item>
              
              <Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { 
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                    message: '请输入有效的邮箱地址'
                  }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  className="cream-input"
                  style={{ height: '40px' }}
                />
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
                  注册
                </Button>
              </Item>
              
              <div className="text-center mt-4">
                <span>已有账号？</span>
                <Button type="link" onClick={() => navigate('/login')}>立即登录</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;