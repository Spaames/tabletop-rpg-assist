'use client';

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const Page = () => {
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
            <Text fontSize="md">Connected ! Welcome </Text>
        </Box>
    );
};

export default Page;
