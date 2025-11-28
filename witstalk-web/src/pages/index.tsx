import {requestSWR} from "~/util/request";
import {showMessage} from "~/util/msg";
import {Button, Card, Typography} from 'antd';

const {Title, Paragraph} = Typography;

export default function AppIndex () {
    const {data, isLoading} = requestSWR({
        url: '/system/error',
        method: 'post',
        data: {
            userId: 123,
            username: "张三"
        }
    })
    console.log(data, isLoading);

    const onclick = () => {
        showMessage.success("dasds")
    }

    return (
        <div className="cream-bg">
            <Card className="cream-card cream-fade-in max-w-md mx-auto" style={{ borderRadius: '12px' }}>
                <div className="cream-header">
                    <Title level={3} className="cream-title">欢迎使用 Witstalk</Title>
                    <Paragraph className="cream-subtitle">这是一个智能聊天平台</Paragraph>
                </div>
                <Button 
                    type="primary" 
                    className="cream-button" 
                    onClick={onclick}
                    block
                    style={{ height: '40px' }}
                >
                    点击显示消息
                </Button>
            </Card>
        </div>
    )
}
