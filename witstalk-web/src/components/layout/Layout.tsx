import {Outlet} from "react-router";
import { Flex, Layout} from "antd";
import TopMenu from "~/components/layout/TopMenu";
import RightTab from "~/components/layout/RightTab";

const {Header, Footer, Sider, Content} = Layout;

export default function AppLayout({children: any}) {
    return (
        <Flex gap="middle" wrap>
            <Layout style={{height: "100%", width: "100vw"}}>
                <Header style={{ background: "var(--cream-light)" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <TopMenu/>
                        </div>
                        <div>
                            <RightTab/>
                        </div>
                    </div>
                </Header>
                <Content style={{height: "86vh", maxHeight: "86vh"}}>
                    <Outlet/>
                </Content>
                <Footer style={{background: "var(--cream-light)"}}>Footer</Footer>
            </Layout>
        </Flex>
    )
}
