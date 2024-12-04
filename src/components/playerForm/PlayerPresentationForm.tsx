"use client"


import {Player, updatePlayer} from "@/redux/features/playerSlice";
import {Box, Button, Flex, HStack, Image, Input, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import ImageSelectorModal from "@/components/ImageSelectorModal";


interface PlayerPresentationFormProps {
    playerData: Player
}

const PlayerPresentationForm: React.FC<PlayerPresentationFormProps> = ({playerData}) => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Contrôle de la modale
    const username = useAppSelector((state) => state.auth.user.username);
    const campaignName = playerData.campaign;

    const handleChange = (field: keyof Player, value: string | number) => {
        dispatch(updatePlayer({ name: playerData.name, updatedData: { [field]: value } }));
    };

    const handleImageSelect = (image: string) => {
        const imagePath = `/${username}/${campaignName}/players/${image}`;
        dispatch(updatePlayer({ name: playerData.name, updatedData: { picture: imagePath } }));
    };


    if (!playerData) {
        return null;
    }

    return (
        <Box>
            <HStack spacing={4}>
                <Image
                    src={playerData.picture}
                    alt="Character Image"
                    boxSize="200"
                    borderRadius="md"
                    objectFit="cover"
                    border="1px solid gray"
                />

                <Box>
                    <Flex alignItems="center" gap={2} mb={3}>
                        <Text as="h2" fontSize="lg" fontWeight="bold">
                            Name:
                        </Text>
                        <Input
                            type="text"
                            size="md"
                            value={playerData.name}
                            isReadOnly={true}
                        />
                    </Flex>
                    <Flex alignItems="center" gap={2} mb={3}>
                        <Text as="h3" fontSize="md" fontWeight="bold">Race:</Text>
                        <Input
                            size={"sm"}
                            w={"110px"}
                            mr={5}
                            type={"text"}
                            value={playerData.race}
                            onChange={(e) => handleChange('race', e.target.value)}
                        />
                        <Text as="h3" fontSize="md" fontWeight="bold">Profile : </Text>
                        <Input
                            size={"sm"}
                            w={"150px"}
                            mr={5}
                            type={"text"}
                            value={playerData.class}
                            onChange={(e) => handleChange('class', e.target.value)}
                        />
                    </Flex>
                    <Flex alignItems="center" gap={2} mb={3}>
                        <Text as="h3" fontSize="md" fontWeight="bold">Level:</Text>
                        <Input
                            size={"sm"}
                            w={"45px"}
                            type={"number"}
                            mr={5}
                            value={playerData.lvl}
                            onChange={(e) => handleChange('lvl', parseInt(e.target.value))}
                        />
                        <Text as="h3" fontSize="md" fontWeight="bold">Sex: </Text>
                        <Input
                            size={"sm"}
                            w={"40px"}
                            mr={5}
                            type={"text"}
                            value={playerData.sex}
                            onChange={(e) => handleChange('sex', e.target.value)}
                        />
                        <Text as="h3" fontSize="md" fontWeight="bold">Age: </Text>
                        <Input
                            size={"sm"}
                            w={"50px"}
                            mr={5}
                            type={"number"}
                            value={playerData.age}
                            onChange={(e) => handleChange('age', parseInt(e.target.value))}
                        />
                        <Text as="h3" fontSize="md" fontWeight="bold">Height: </Text>
                        <Input
                            size={"sm"}
                            w={"50px"}
                            mr={5}
                            type={"number"}
                            value={playerData.height}
                            onChange={(e) => handleChange('height', parseInt(e.target.value))}
                        />
                        <Text as="h3" fontSize="md" fontWeight="bold">Weight: </Text>
                        <Input
                            size={"sm"}
                            w={"50px"}
                            mr={5}
                            type={"number"}
                            value={playerData.weight}
                            onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                        />
                    </Flex>
                </Box>
            </HStack>
            {/* Bouton pour ouvrir la modale */}
            <Button mt={4} colorScheme="teal" onClick={() => setIsModalOpen(true)}>
                Select Character Image
            </Button>

            {/* Modale réutilisable */}
            <ImageSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                username={username}
                campaignName={campaignName}
                folder="players"
                onSelect={handleImageSelect}
            />
        </Box>
    );
}

export default PlayerPresentationForm;