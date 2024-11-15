"use client";
import React from "react";
import {ReduxProvider} from "@/redux/provider";
import {ChakraProvider} from "@chakra-ui/react";

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>Tabletop RPG Assist</title>
            </head>
            <body>
                <ReduxProvider>
                    <ChakraProvider>
                        {children}
                    </ChakraProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}