import { useState } from 'react';
import { LoginPage } from './auth/LoginPage';
import { TasksPage } from './tasks/TasksPage';

export default function App() {
    const [auth, setAuth] = useState(false);

    return auth ? <TasksPage /> : <LoginPage onSuccess={() => setAuth(true)} />;
}
