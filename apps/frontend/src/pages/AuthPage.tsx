import React, {useCallback, useState} from 'react';
import {
    Box,
    Card,
    Tabs,
    Tab,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import {useAuthContext} from "@app/shared/auth/useAuthContext.ts";

export default function AuthPage() {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, register} = useAuthContext();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (tab === 0) {
            await login(email, password);
        } else {
            await register(email, password);
        }
    }

    const didEmailChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        },
        []
    );

    const didPasswordChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
        },
        []
    );

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            sx={{
                background: 'radial-gradient(1200px circle at top, #1b2240 0%, #0f1218 40%)',
            }}
        >
            <Card
                sx={{
                    width: 420,
                    p: 4,
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
            >
                <Typography variant="h5" fontWeight={600} textAlign="center">
                    {tab === 0 ? 'Welcome back' : 'Create account'}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mt={1}
                    mb={3}
                >
                    {tab === 0
                        ? 'Sign in to continue'
                        : 'Register to get started'}
                </Typography>

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                    sx={{mb: 3}}
                >
                    <Tab label="Login"/>
                    <Tab label="Register"/>
                </Tabs>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        onChange={didEmailChanged}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        onChange={didPasswordChanged}
                    />

                    {tab === 1 && (
                        <TextField
                            fullWidth
                            label="Confirm password"
                            type="password"
                            margin="normal"
                        />
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{mt: 3, py: 1.2}}
                    >
                        {tab === 0 ? 'Login' : 'Register'}
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
