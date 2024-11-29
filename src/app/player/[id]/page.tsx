"use client"

import {Box, Button, Heading, VStack} from "@chakra-ui/react";
import {useAppSelector} from "@/redux/hook";
import Link from "next/link";
import React from "react";

export default function Page({ params }: { params: { id: string } }) {
    const player = useAppSelector(state => state.player.players.find(player => player.name === decodeURI(params.id)));


    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
        >
            <Box
                display="flex"
                flex="1"
            >
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    Colonne gauche
                </Box>
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    Colonne droite
                </Box>
            </Box>
        </Box>
    );
};