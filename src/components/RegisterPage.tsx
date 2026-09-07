import { Box, Button, Card, Container, Divider, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { generateRandomName } from '../api/helper';
// Remove this: import ShuffleIcon from '@mui/icons-material/Shuffle';
import CasinoIcon from '@mui/icons-material/Casino'; // Add this
import VerifyNotice from './VerifyNotice';

export default function RegisterPage() {
    // const navigate = useNavigate();
    // const { login } = useAuth();
    const [isWaitingForEmail, setIsWaitingForEmail] = useState(false);
    const [usernameError, setUsernameError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        displayname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); // using spread with field of the same name will update it, order matters
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    display_name: formData.displayname,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (response.ok) {
                setIsWaitingForEmail(true); // Switch the UI to show the "Check Email" message
            }

            // const data: any = await response.json();
            // if (data.success) {
            //     // Auto-login after successful registration
            //     login(data.user, data.token);
            //     navigate('/');
            // } else {
            //     alert(data.error || "Registration failed");
            // }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const handleShuffle = () => {
        const randomName = generateRandomName(); // Your naming logic
        // Manually trigger handleChange or update state directly
        setFormData(prev => ({ ...prev, displayname: randomName }));
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Regex: Only lowercase, numbers, hyphens, and underscores
        const usernameRegex = /^[a-z0-9_-]*$/;

        if (!usernameRegex.test(value)) {
            setUsernameError("Usernames can only contain lowercase letters, numbers, - and _");
        } else if (value.length > 0 && value.length < 3) {
            setUsernameError("Username is too short");
        } else {
            setUsernameError("");
        }

        handleChange(e); // Continue with your existing state update
    };

    if (isWaitingForEmail) {
        return (
            <VerifyNotice email={formData.email} onBack={() => {setIsWaitingForEmail(false)}} />
        );
    }


    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
                <Card sx={{ p: 4, width: '100%', borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Join us to track your orders and manage your profile
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="DisplayName"
                            name="displayname"
                            value={formData.displayname} // Ensure the field is controlled
                            variant="outlined"
                            onChange={handleChange}
                            required
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShuffle} edge="end">
                                                <CasinoIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            variant="outlined"
                            value={formData.username}
                            onChange={handleUsernameChange}
                            error={Boolean(usernameError)}
                            helperText={usernameError || "Used for your unique system ID"}
                            required
                            slotProps={{
                                input: {
                                    // Force lowercase as the user types for better UX
                                    style: { textTransform: 'lowercase' }
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            variant="outlined"
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            variant="outlined"
                            onChange={handleChange}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ mt: 1, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Create Account
                        </Button>
                    </Box>

                    <Box sx={{ my: 3 }}>
                        <Divider sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>OR REGISTER WITH</Divider>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <GoogleLogin
                            onSuccess={(res) => console.log("Google Reg Success", res)}
                            onError={() => console.log('Error')}
                        />
                    </Box>

                    <Typography variant="body2" align="center" color="text.secondary">
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </Typography>
                </Card>
            </Box>
        </Container>
    );
};