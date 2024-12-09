"use client"

import {Box, Button, Card, CardBody, Divider, Heading, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import React, {useEffect, useState} from "react";
import PlayerCreatorModal from "@/components/PlayerCreatorModal";
import {getPlayerAPI} from "@/redux/features/playerSlice";
import Link from "next/link";

 export default function Page({ params }: { params: {id: string} }) {
     const campaign = useAppSelector((state) => state.campaign.campaigns.find(campaign => campaign.name === params.id));
     const dispatch = useAppDispatch();
     const [isModalOpen, setModalOpen] = useState(false);
     const playerListStore = useAppSelector((state) => state.player.players);

     useEffect(() => {
         if (campaign) {
             dispatch(getPlayerAPI(campaign.name));
         }
     }, []);

     const openModal = () => setModalOpen(true);
     const closeModal = () => setModalOpen(false);

    if (!campaign) {
        return(
            <Text>Loading campaign data...</Text>
        )
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
        >
            <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="left"
            >
                <Heading as={"h1"} size={"lg"} ml={4}>{campaign.username.toUpperCase()} -- {campaign.name}</Heading>
            </Box>
            <Box
                display="flex"
                flex="8"
            >
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <VStack spacing={4} alignItems="center">
                        <Heading as="h2" fontSize="xl">Players :</Heading>
                        <Card>
                            <CardBody>
                                <SimpleGrid
                                    columns={2}
                                    spacing={4}
                                    width="100%"
                                    justifyItems="center"
                                    alignItems="center"
                                >
                                    {playerListStore && playerListStore.length > 0 && (
                                        [...playerListStore].reverse().map((player, index) => (
                                            player && player.name ? (
                                                <Link key={index} href={`/player/${player.name}`} passHref>
                                                    <Button
                                                        variant="outline"
                                                        mb={2}
                                                    >
                                                        {player.name}
                                                    </Button>
                                                </Link>
                                            ) : null
                                        ))
                                    )}
                                </SimpleGrid>

                            </CardBody>
                        </Card>
                        <Button onClick={openModal} mb={2}>+ Player Creator +</Button>
                        <Divider />
                        <Link href={`/entities/${campaign.name}`} passHref>
                            <Button
                            variant="outline"
                            mb={2}
                            mt={2}
                            >
                                Entity list
                            </Button>
                        </Link>
                    </VStack>
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
            <PlayerCreatorModal isOpen={isModalOpen} onClose={closeModal} campaignName={campaign.name} />
        </Box>
    );
};