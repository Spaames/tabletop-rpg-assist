'use client'

import {FormEvent, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {useRouter} from "next/navigation";
import {registerAPI} from "@/redux/features/authSlice";
import {Alert, AlertIcon, Box, Button, Heading, Input} from "@chakra-ui/react";

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { error, loading } = useAppSelector((state) => state.auth)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(registerAPI(username, password));
        router.push("/login");
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
                Register
            </Heading>
            {error && (
                <Alert status="error" mb={4} w="300px">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <Input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                mb={4}
                w="300px"
            />
            <Input
                placeholder="password"
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
                Submit
            </Button>
        </Box>
    );
};

export default RegisterForm;