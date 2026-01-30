import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthPage } from "../pages/AuthPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthPage />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                zxc
                {/*<TasksPage />*/}
            </ProtectedRoute>
        ),
    },
]);
