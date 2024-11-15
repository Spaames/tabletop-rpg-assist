'use client';

import React, {FormEvent, useState} from 'react';
import { Box, Button, Heading, Input, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {loginAPI} from "@/redux/features/authSlice";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { error, loading, isAuthenticated} = useAppSelector((state) => state.auth)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(loginAPI(username, password));
    };

    if (isAuthenticated) {
        router.push("/home");
    }

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
                isLoading={loading}
            >
                Login
            </Button>
        </Box>
    );
};

export default LoginForm;
