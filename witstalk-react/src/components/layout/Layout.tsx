import React, {useEffect} from "react";
import {Outlet} from "react-router";
import {ConfigProvider, Flex, Layout, message} from "antd";
import {LeftMenu} from "~/components/layout/leftMenu";
import {useNavigate} from 'react-router'
import {MessageProvider} from "~/util/msg";

const {Header, Footer, Sider, Content} = Layout;

export function AppLayout({children}) {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    // 检查当前是不是客户端的渲染
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!window.localStorage.getItem("token")) {
                messageApi.warning("请先登录!", 1).then(r => {
                    navigate('/login');
                })
            }
        }
    })

    return (
        <Flex>
            <Layout style={{height: "100vh", width: "100vw"}}>
                <Header>Header</Header>
                <Layout>
                    <Sider width="15%">
                        <LeftMenu/>
                    </Sider>
                    <Content>
                        <Outlet/>
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
        </Flex>
    )
}
