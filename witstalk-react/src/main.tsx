import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {AppRouter} from "~/router";
import {App, ConfigProvider} from "antd";
import {MessageProvider} from "~/util/msg";

import '~/index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                cssVar: true,
                // token: {
                //     // Seed Token，影响范围大
                //     colorPrimary: '#f759ab',
                //     borderRadius: 2,
                //     // 派生变量，影响范围小
                //     colorBgContainer: '#fff0f6',
                // }
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
