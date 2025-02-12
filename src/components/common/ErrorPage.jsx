import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    
    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <DangerousIcon sx={{ fontSize: 80, color: 'error.main' }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                    404 | Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    The page you are looking for might have been removed or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                >
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default ErrorPage;
