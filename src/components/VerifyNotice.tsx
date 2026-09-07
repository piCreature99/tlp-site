import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Fade } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function VerifyNotice({ email, onBack }: { email: string, onBack: () => void }){
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <Fade in={true} timeout={800}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mt: 4 }}>
                <Box sx={{ mb: 2 }}>
                    <MarkEmailReadIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                
                <Typography variant="h5" gutterBottom>
                    Check your inbox!
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We've sent a verification link to: <br />
                    <strong>{email}</strong>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Click the link in the email to complete your account setup.
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Button 
                        fullWidth
                        variant="contained" 
                        onClick={onBack}
                        disabled={countdown > 0}
                    >
                        {countdown > 0 
                            ? `Resend available in ${countdown}s` 
                            : 'Back to Register'}
                    </Button>
                </Box>
                
                {countdown > 0 && (
                    <Typography variant="caption" sx={{ mt: 1 }} color="text.secondary">
                        Didn't get the email? You can try again after the timer ends.
                    </Typography>
                )}
            </Paper>
        </Fade>
    );
};
