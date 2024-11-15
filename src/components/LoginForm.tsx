'use client';

import React, { useState } from 'react';
import { Box, Button, Heading, Input, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosConfig';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        setError('');
        try {
            const response = await axiosInstance.post('/api/login', {
                username,
                password,
            });
            if (response.data.status === 'success') {
                router.push('/home');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Connection failed : ' + err);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            p={4}
        >
            <Heading as="h1" size="lg" mb={4}>
                Connexion
            </Heading>
            {error && (
                <Alert status="error" mb={4} w="300px">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                mb={4}
                w="300px"
            />
            <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mb={4}
                w="300px"
            />
            <Button
                colorScheme="blue"
                w="300px"
                onClick={handleSubmit}
            >
                Login
            </Button>
        </Box>
    );
};

export default LoginForm;
