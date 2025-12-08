import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {AppRouter} from "~/router";
import {App, ConfigProvider} from "antd";
import {MessageProvider} from "~/util/msg";
import zhCN from 'antd/locale/zh_CN';

import '~/index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider
            locale={zhCN}
            theme={{
                // Remove cssVar: true as it's causing a type error
            }}
        >
            <App>
                <MessageProvider>
                    <AppRouter />
                </MessageProvider>
            </App>
        </ConfigProvider>
    </StrictMode>
)
