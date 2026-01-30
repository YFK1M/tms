import {
    Box,
    Card,
    Tabs,
    Tab,
    TextField,
    Button,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useAuth } from '@app/shared/auth/useAuth';

export const AuthPage = () => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (tab === 0) {
            await login(email, password);
        } else {
            await register(email, password);
        }
    }

    const didEmailChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, [])

    const didPasswordChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, [])

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            bgcolor="#f5f5f5"
        >
            <Card sx={{ width: 400, p: 3 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                <Box mt={3} component="form">
                    <TextField fullWidth label="Email" margin="normal" onChange={didEmailChanged} />
                    <TextField fullWidth label="Password" type="password" margin="normal" onChange={didPasswordChanged} />

                    {tab === 1 && (
                        <TextField
                            fullWidth
                            label="Confirm password"
                            type="password"
                            margin="normal"
                        />
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                    >
                        {tab === 0 ? 'Login' : 'Register'}
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};
