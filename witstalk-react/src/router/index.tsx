import { createBrowserRouter, RouterProvider} from "react-router";
import {AppLayout} from "~/components/layout/Layout.tsx";
import {ErrorBoundary} from "~/components/ErrorBoundary.tsx";
import React, {Suspense} from "react";

const AppIndex = React.lazy(() => import("~/pages/index.tsx"))

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                index: true, element: (
                    <Suspense fallback={<div>加载中...</div>}>
                        <AppIndex/>
                    </Suspense>
                ),
            }
        ]
    }
])

export const AppRouter = () => {
    return (
        <RouterProvider router={router} />
    );
}
