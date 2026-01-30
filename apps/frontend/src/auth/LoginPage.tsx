import { useState } from 'react';
import { login } from '../api/auth.api';

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        await login(email, password);
        onSuccess();
    }

    return (
        <form onSubmit={submit}>
            <h2>Login</h2>
            <input value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button>Login</button>
        </form>
    );
}
