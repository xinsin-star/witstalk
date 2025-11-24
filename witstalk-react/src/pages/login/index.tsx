import React from "react";
import {Flex, Layout, Button, Checkbox, Form, Input} from 'antd';
import {request} from "~/util/request";
import {useNavigate} from "react-router";

const layoutStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    height: "100vh",
    justifyContent: "center"
}
const titleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
}

export const Login = () => {
    const navigate = useNavigate();

    const onFinish = (form) => {
        request({
            url: '/user/login',
            method: 'POST',
            data: {
                username: form.username,
                password: form.password,
            }
        }).then(res => {
            navigate("/")
        }).finally(() => {

        })
    }

    return (
        <Flex>
            <Layout style={layoutStyle}>
                <div style={{display: "flex", alignItems: "center", flexDirection: "column", width: "500px"}}>
                    <div>
                        <span style={titleStyle}>权限控制系统</span>
                    </div>
                    <div>
                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            initialValues={{remember: true}}
                            style={{width: "400px"}}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="用户名"
                                name="username"
                                rules={[{required: true, message: '请输入你的用户名!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="密码"
                                name="password"
                                rules={[{required: true, message: '请输入你的密码!'}]}
                            >
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>

                            <Form.Item label={null}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <Button type="primary" htmlType="submit">
                                        登陆
                                    </Button>
                                    <span>还没有账号? 点我去注册!</span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        </Flex>
    )
}
