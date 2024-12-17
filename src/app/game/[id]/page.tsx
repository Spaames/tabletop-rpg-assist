"use client"

import {
    Box,
    Button,
    Heading,
    HStack,
    VStack
} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import React, {useState} from "react";
import ImageSelectorModal from "@/components/ImageSelectorModal";
import {updateBackground} from "@/redux/features/gameSlice";

export default function Page({ params }: { params: {id: string} }) {
    const url = decodeURI(params.id);
    const urlSplit = url.split("-");
    const campaignUrl = urlSplit[0];
    const userUrl = urlSplit[1];

    const dispatch = useAppDispatch();
    const entities = useAppSelector((state) => state.entity.entities.find(entity => entity.campaign === campaignUrl));
    const players = useAppSelector((state) => state.player.players.find(player => player.campaign === campaignUrl));

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Contrôle de la modale

    const handleImageSelect = (image: string) => {
        const imagePath = `/${userUrl}/${campaignUrl}/background/${image}`;
        dispatch(updateBackground(imagePath));
    };

    const openRenderPage = () => {
        const renderUrl = "/render";
        window.open(renderUrl, "_blank");
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
                <Heading as={"h1"} size={"lg"} ml={4}>test</Heading>
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
                                   Selectionner une image de fond
                               </Button>
                               <Button
                               onClick={openRenderPage}
                               >
                                   Ouvrir le rendu PJ
                               </Button>
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
                    Composants rendu en fonction de ce qui est choisit à gauche

                </Box>
            </Box>
        </Box>
    )
}

