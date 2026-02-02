import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "@app/shared/auth/auth.provider.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import {ProtectedRoute} from "@app/app/ProtectedRoute.tsx";
import AuthPage from "@app/pages/AuthPage.tsx";
import TasksPage from "@app/pages/TasksPage.tsx";
import LogoutPage from "@app/pages/LogoutPage.tsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0f1218',
            paper: '#151a23',
        },
        primary: {
            main: '#6c8cff',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
    },
});

export default function App() {

    return (
        <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/auth" element={<AuthPage/>} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <TasksPage/>
                            </ProtectedRoute>
                        } />
                        <Route path="/logout" element={<LogoutPage/>} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}
