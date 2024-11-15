'use client'

import React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import theme from "@/theme";

export function ChakraProviders({
                                    children
                                }: {
    children: React.ReactNode
}) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <ChakraProvider theme={theme}>
            {mounted && children}
        </ChakraProvider>
    )
}