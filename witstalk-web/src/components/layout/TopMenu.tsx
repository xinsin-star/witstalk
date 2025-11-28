import {Menu} from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: '首页',
        key: '/',
        icon: <MailOutlined />,
    },
    {
        label: 'witstalk',
        key: '/witstalk',
        icon: <MailOutlined />,
    },
    {
        label: '文件',
        key: '/file',
        icon: <AppstoreOutlined />
    },
    {
        label: '游戏',
        key: '/game',
        icon: <AppstoreOutlined />
    },
    {
        label: '系统',
        key: '/system',
        icon: <SettingOutlined />
    }
];

export default function TopMenu() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('/');

    const onClick = ({ item, key, keyPath, domEvent }) => {
        navigate(key);
        setCurrent(key);
    }

    return (
        <>
            <Menu
                onClick={onClick}
                style={{ width: '50vw', backgroundColor: 'var(--cream-light)' }}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
            />
        </>
    )
}
