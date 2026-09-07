import { useState } from 'react';
import { Box, Card, Container, Typography, TextField, Button, Divider, Link } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { login } = useAuth();

    // Local state for traditional login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleTraditionalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Logic for your Go/Worker login endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            // console.log(response);
            const data: any = await response.json();
            if (data.success) {
                login(data.user, data.token);
                navigate(state?.from || '/');
            } else {
                alert(data.error || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data: any = await response.json();
            if (data.success) {
                login(data.user, data.token);
                navigate(state?.from || '/');
            }
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
                <Card sx={{ p: 4, width: '100%', borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Sign In
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Keep track of your orders now!
                    </Typography>

                    {/* Traditional Login Form */}
                    <Box component="form" onSubmit={handleTraditionalLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large" 
                            sx={{ mt: 1, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Sign In
                        </Button>
                    </Box>

                    <Box sx={{ my: 3 }}>
                        <Divider sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>OR</Divider>
                    </Box>

                    {/* Google Login */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Error')}
                        />
                    </Box>

                    {/* Register Link */}
                    <Typography variant="body2" align="center" color="text.secondary">
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/register" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                            Create an account
                        </Link>
                    </Typography>
                </Card>
            </Box>
        </Container>
    );
};