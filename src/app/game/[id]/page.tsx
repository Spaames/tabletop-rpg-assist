"use client";

import {
    Box,
    Button, Card, CardBody, CardHeader, Divider,
    Heading,
    HStack, Stack, StackDivider, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import React, {useEffect, useState} from "react";
import ImageSelectorModal from "@/components/ImageSelectorModal";
import {addCard, getAllSceneThunk, getSceneThunk, removeCard, Scene} from "@/redux/features/sceneSlice";
import {Player} from "@/redux/features/playerSlice";
import {Entity} from "@/redux/features/entitySlice";

export default function Page({ params }: { params: { id: string } }) {
    const url = decodeURI(params.id);
    const urlSplit = url.split("-");
    const campaignUrl = urlSplit[0];
    const userUrl = urlSplit[1];

    const [currentScene, setCurrentScene] = useState<Scene>({
        background: "",
        music: "",
        cards: []
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    //recup de puis le store
    const dispatch = useAppDispatch();
    const players = useAppSelector((state) =>
        state.player.players.filter((player) => player.campaign === campaignUrl)
            .sort((a, b) => a.name.localeCompare(b.name))
    );
    const entities = useAppSelector((state) =>
        state.entity.entities.filter((entity) => entity.campaign === campaignUrl)
            .sort((a, b) => a.name.localeCompare(b.name))
    );
    //les scenes sont init quand on clique sur lancer la partie, avant
    const scenes = useAppSelector((state) =>
        state.scene.scenes);

    // Au montage, on récupère toutes les scènes depuis la BDD via getAllSceneThunk
    useEffect(() => {
        dispatch(getAllSceneThunk());
    }, [dispatch]);

    //pour savoir si une scène est selectionnée
    const isSceneDefault = currentScene.background === "" && currentScene.music === "" && currentScene.cards.length === 0;

    //pour garder currentScene à jour avec redux
    useEffect(() => {
        if (!currentScene.background) return;
        const updatedScene = scenes.find(
            (scene) => scene.background === currentScene.background
        );
        if (updatedScene && updatedScene !== currentScene) {
            setCurrentScene(updatedScene);
        }
    }, [currentScene, scenes]);

    //ouvre la modale pour choisir une scene
    const handleImageSelect = async (image: string) => {
        const imagePath = `/${userUrl}/${campaignUrl}/scenes/${image}`;

        await dispatch(getSceneThunk(imagePath));


        const selectedScene = scenes.find(scene => scene.background === imagePath);
        setCurrentScene(selectedScene ?? { background: "", music: "", cards: [] });
        sendCurrentScene(selectedScene ?? { background: "", music: "", cards: [] });
    };

    const sendCurrentScene = async (scene: Scene) => {
        try {
            const response = await fetch('/api/getCurrentScene', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ scene }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la scène');
            }

            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    const openRenderPage = () => {
        const renderUrl = "/render";
        window.open(renderUrl, "_blank");
    };

    const addPlayerEntity = (entity: Player | Entity) => {
        if (!currentScene || currentScene.background === "") {
            console.warn("Aucune scène sélectionnée pour ajouter un joueur ou une entité.");
            return;
        }

        const newCard = {
            id: Date.now(),
            identity: entity,
            position: { x: 0, y: 0 } // Position par défaut
        };

        // Dispatch Redux pour ajouter la carte
        dispatch(addCard({ background: currentScene.background, card: newCard }));

        // Mise à jour côté API
        sendCurrentScene({
            ...currentScene,
            cards: [...currentScene.cards, newCard]
        });

        console.log(`Ajouté : ${entity.name} à la scène ${currentScene.background}`);
    };

    const removePlayerEntity = (id: number) => {
        if (!currentScene || currentScene.background === "") {
            console.warn("Aucune scène sélectionnée pour ajouter un joueur ou une entité.");
            return;
        }

        dispatch(removeCard({ background: currentScene.background, cardId: id}));

        sendCurrentScene({
            ...currentScene,
            cards: currentScene.cards.filter(card => card.id !== id),
        });

        console.log(`Retiré : carte avec l'ID ${id} de la scène ${currentScene.background}`);
    }


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
                            <HStack spacing={4} alignItems="center" mb={5}>
                                <ImageSelectorModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    username={userUrl}
                                    campaignName={campaignUrl}
                                    folder="scenes"
                                    onSelect={handleImageSelect}
                                />
                                <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
                                    Sélectionner une scène
                                </Button>
                                <Button onClick={openRenderPage}>Ouvrir la scène</Button>
                            </HStack>
                            <Divider mt={5} mb={5} />
                            <TableContainer mt={5}>
                                <Table size={"sm"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Joueurs</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {players.map((player, index) => (
                                            <Tr key={index}>
                                                <Td>{player.name}</Td>
                                                <Td>
                                                    <Button
                                                    colorScheme="blue"
                                                    onClick={() => {addPlayerEntity(player)}}>
                                                        +
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Divider mt={5} mb={5} />
                            <TableContainer mt={5}>
                                <Table size={"sm"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Entités</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {entities.map((entity, index) => (
                                            <Tr key={index}>
                                                <Td>{entity.name}</Td>
                                                <Td>
                                                    <Button
                                                    colorScheme="blue"
                                                    onClick={() => {addPlayerEntity(entity)}}>
                                                        +
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </VStack>
                </Box>
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {isSceneDefault ? (
                        <Box p={4} textAlign="center">
                            <Heading size="md">Pas de scène sélectionnée</Heading>
                            <Text fontSize="sm" color="gray.500">
                                Veuillez sélectionner une scène pour afficher ses détails.
                            </Text>
                        </Box>
                    ) : (
                        <Card width="90%">
                            <CardHeader>
                                <Heading size={"md"}>Scene en cours : </Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack divider={<StackDivider />} spacing={4}>
                                    <Box mb={4}>
                                        <Heading size={"xs"} textTransform={"uppercase"}>
                                            Nom
                                        </Heading>
                                        <Text pt={2} fontSize={"sm"}>
                                            {currentScene.background}
                                        </Text>
                                    </Box>
                                    <Box mt={4} mb={4}>
                                        <Heading size={"xs"} textTransform={"uppercase"}>
                                            Joueurs / Entités présents
                                        </Heading>
                                        <Table size={"sm"}>
                                            <TableContainer>
                                                <Thead>
                                                    <Th>Nom</Th>
                                                    <Th>PV</Th>
                                                    <Th>Remove</Th>
                                                </Thead>
                                                <Tbody>
                                                    {currentScene.cards.length === 0 ? (
                                                        <Text fontSize={"sm"}>Pas de joueurs ou entités présents</Text>
                                                    ) : (
                                                        currentScene.cards.map((card, index) => (
                                                            <Tr key={index}>
                                                                <Td>{card.identity.name}</Td>
                                                                <Td>{card.identity.HP}</Td>
                                                                <Td>
                                                                    <Button
                                                                        colorScheme="red"
                                                                        onClick={() => {removePlayerEntity(card.id)}}>
                                                                        +
                                                                    </Button>
                                                                </Td>
                                                            </Tr>
                                                        ))
                                                    )}
                                                </Tbody>
                                            </TableContainer>
                                        </Table>
                                    </Box>
                                </Stack>
                            </CardBody>
                        </Card>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
