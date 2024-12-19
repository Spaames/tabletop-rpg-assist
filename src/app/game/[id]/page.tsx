"use client";

import {
    Box,
    Button,
    Heading,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import React, { useState } from "react";
import ImageSelectorModal from "@/components/ImageSelectorModal";
import { updateBackground } from "@/redux/features/gameSlice";

export default function Page({ params }: { params: { id: string } }) {
    const url = decodeURI(params.id);
    const urlSplit = url.split("-");
    const campaignUrl = urlSplit[0];
    const userUrl = urlSplit[1];

    const dispatch = useAppDispatch();
    const players = useAppSelector((state) =>
        state.player.players.filter((player) => player.campaign === campaignUrl)
    );
    const entities = useAppSelector((state) =>
        state.entity.entities.filter((entity) => entity.campaign === campaignUrl)
    );

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Nouvelle fonction pour mettre à jour l'image dans l'API
    const updateBgImageAPI = async (imagePath: string) => {
        try {
            const response = await fetch("/api/getCurrentBgImage", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ background: imagePath }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de l'image");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageSelect = (image: string) => {
        const imagePath = `/${userUrl}/${campaignUrl}/background/${image}`;

        // Met à jour Redux
        dispatch(updateBackground(imagePath));

        // Met à jour l'API
        updateBgImageAPI(imagePath);
    };

    const openRenderPage = () => {
        const renderUrl = "/render";
        window.open(renderUrl, "_blank");
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Box flex="1" display="flex" alignItems="center" justifyContent="left">
                <Heading as={"h1"} size={"lg"} ml={4}>
                    Contrôle MJ
                </Heading>
            </Box>
            <Box display="flex" flex="8">
                <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                    <VStack spacing={4} alignItems="center">
                        <Box alignItems="center" justifyContent="center">
                            <HStack spacing={4} alignItems="center">
                                <ImageSelectorModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    username={userUrl}
                                    campaignName={campaignUrl}
                                    folder="background"
                                    onSelect={handleImageSelect}
                                />
                                <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
                                    Sélectionner une image de fond
                                </Button>
                                <Button onClick={openRenderPage}>Ouvrir le rendu PJ</Button>
                            </HStack>
                        </Box>
                    </VStack>
                </Box>
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    Composants rendu en fonction de ce qui est choisi à gauche
                </Box>
            </Box>
        </Box>
    );
}
