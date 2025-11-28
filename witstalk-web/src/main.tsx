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
                cssVar: true
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
