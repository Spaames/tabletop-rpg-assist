"use client"

import {Box, Text, Grid, GridItem, Spacer, Button, HStack} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import React from "react";
import PlayerPresentationForm from "@/components/playerForm/PlayerPresentationForm";
import PlayerStatsForm from "@/components/playerForm/PlayerStatsForm";
import PlayerInventoryForm from "@/components/playerForm/PlayerInventoryForm";
import PlayerAbilitiesForm from "@/components/playerForm/PlayerAbilitiesForm";
import {updatePlayerAPI} from "@/redux/features/playerSlice";

export default function Page({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();
    const player = useAppSelector(state => state.player.players.find(player => player.name === decodeURI(params.id)));

    const handleUpload = () => {
        if (player) {
            dispatch(updatePlayerAPI(player));
        }
    }


    if (!player) {
        return(
            <Text>Error while getting player&#39;s data, please go back</Text>
        );
    }

    return (
        <Box>
            <Grid
                templateRows="auto 1fr"
                templateColumns="200px 1fr 1fr"
                gap={4}
                p={4}
                w="100vw"
                h="100vh"
            >
                <GridItem colSpan={3} p={4} border="1px solid" borderColor="gray" borderRadius="md">
                    <HStack>
                        <PlayerPresentationForm playerData={player} />
                        <Spacer />
                        <Button
                            colorScheme="green"
                            onClick={handleUpload}
                        >
                            UPDATE
                        </Button>
                    </HStack>
                </GridItem>

                <GridItem p={4} borderRadius="md" border="1px solid" borderColor="gray">
                    <PlayerStatsForm playerData={player} />
                </GridItem>

                <GridItem p={4} borderRadius="md" border="1px solid" borderColor="gray">
                    <PlayerInventoryForm playerData={player} />
                </GridItem>

                <GridItem p={4} borderRadius="md" border="1px solid" borderColor="gray">
                    <PlayerAbilitiesForm playerData={player} />
                </GridItem>
            </Grid>
        </Box>
    );
};