import { createBrowserRouter, RouterProvider } from "react-router";
import React, { Suspense } from "react";
import { Spin } from "antd";
import { ErrorBoundary } from "~/components/ErrorBoundary.tsx";

// 懒加载组件
const AppLayout = React.lazy(() => import("~/components/layout/Layout.tsx"));
const AppIndex = React.lazy(() => import("~/pages/index.tsx"));
const LoginPage = React.lazy(() => import("~/pages/login/index.tsx"));
const RegisterPage = React.lazy(() => import("~/pages/register/index.tsx"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Spin size="large" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}>
                <AppLayout>children</AppLayout>
            </Suspense>
        ),
        errorElement: <ErrorBoundary error={{ status: 500 }} />,
        children: [
            {
                index: true, element: (
                    <Suspense fallback={<Spin size="large" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}>
                        <AppIndex/>
                    </Suspense>
                ),
            }
        ]
    },
    {
        path: "/login",
        element: (
            <Suspense fallback={<Spin size="large" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}>
                <LoginPage/>
            </Suspense>
        ),
        errorElement: <ErrorBoundary error={{ status: 500 }} />
    },
    {
        path: "/register",
        element: (
            <Suspense fallback={<Spin size="large" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}>
                <RegisterPage/>
            </Suspense>
        ),
        errorElement: <ErrorBoundary error={{ status: 500 }} />
    }
])

export const AppRouter = () => {
    return (
        <RouterProvider router={router} />
    );
}
