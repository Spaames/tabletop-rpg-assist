'use client';

import React from 'react';
import {Alert, AlertIcon, Box, Heading, Spinner, Text} from '@chakra-ui/react';
import {useAppSelector} from "@/redux/hook";
const Page = () => {
    const {user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Heading as="h1" size="lg">
                    You are not logged in :(
                </Heading>
            </Box>
        );
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
                Home page !
            </Heading>
            <Text fontSize="md">Connected ! Welcome {user.username} </Text>
        </Box>
    );
};

export default Page;
