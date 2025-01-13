"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    HStack,
    Stack,
    StackDivider,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react";

// Redux
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
    Scene,
    getAllSceneThunk,      // => GET /api/scenes
    getSceneThunk,          // => POST /api/getScene
    updateSceneThunk,       // => PUT /api/updateScene
    addCard,
    removeCard,
} from "@/redux/features/sceneSlice";

import { updateCampaignSceneAPI } from "@/redux/features/campaignSlice";

import { Player } from "@/redux/features/playerSlice";
import { Entity } from "@/redux/features/entitySlice";

// Composant de sélection d'image
import ImageSelectorModal from "@/components/ImageSelectorModal";

export default function ControlPage({ params }: { params: { id: string } }) {
    // L'URL param, ex: "Bloodborne-rdu"
    const url = decodeURI(params.id);
    const [campaignUrl, userUrl] = url.split("-");

    const dispatch = useAppDispatch();

    // Scenes en Redux
    const scenes = useAppSelector((state) => state.scene.scenes);

    // État local : la scène sélectionnée
    const [currentScene, setCurrentScene] = useState<Scene>({
        background: "",
        music: "",
        cards: [],
    });

    // Joueurs & Entités de cette campagne
    const players = useAppSelector((state) =>
        state.player.players
            .filter((p: Player) => p.campaign === campaignUrl)
            .sort((a, b) => a.name.localeCompare(b.name))
    );

    const entities = useAppSelector((state) =>
        state.entity.entities
            .filter((e: Entity) => e.campaign === campaignUrl)
            .sort((a, b) => a.name.localeCompare(b.name))
    );

    // Modale
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ─────────────────────────────────────────────
    // (A) Au montage : récupérer toutes les scènes
    // ─────────────────────────────────────────────
    useEffect(() => {
        dispatch(getAllSceneThunk());
    }, [dispatch]);

    // ─────────────────────────────────────────────
    // (B) Polling pour rafraîchir la scène sélectionnée
    //     via POST /api/getScene (getSceneThunk)
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (!currentScene.background) return;
        const interval = setInterval(() => {
            dispatch(getSceneThunk(currentScene.background));
        }, 2000);
        return () => clearInterval(interval);
    }, [dispatch, currentScene.background]);

    // ─────────────────────────────────────────────
    // (C) Synchroniser currentScene avec Redux
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (!currentScene.background) return;
        const sceneInStore = scenes.find((s) => s.background === currentScene.background);
        if (sceneInStore && sceneInStore !== currentScene) {
            setCurrentScene(sceneInStore);
        }
    }, [scenes, currentScene]);

    // ─────────────────────────────────────────────
    // Sélection d'une nouvelle scène
    // ─────────────────────────────────────────────
    const handleImageSelect = (image: string) => {
        const imagePath = `/${userUrl}/${campaignUrl}/scenes/${image}`;

        // Vérifie si la scène existe déjà dans Redux
        const existingScene = scenes.find((s) => s.background === imagePath);
        if (existingScene) {
            setCurrentScene(existingScene);
        } else {
            // Sinon on crée un objet local + on l'envoie en BDD
            const newScene: Scene = {
                background: imagePath,
                music: "",
                cards: [],
            };
            setCurrentScene(newScene);
            dispatch(updateSceneThunk(newScene));
        }

        // Mettre à jour la campagne => currentScene = imagePath
        dispatch(updateCampaignSceneAPI(userUrl, campaignUrl, imagePath));

        setIsModalOpen(false);
    };

    // ─────────────────────────────────────────────
    // Ajouter un player / entité => addCard => updateScene
    // ─────────────────────────────────────────────
    const addPlayerEntity = (entity: Player | Entity) => {
        if (!currentScene.background) return;

        const newCard = {
            id: Date.now(),
            identity: entity,
            position: { x: 0, y: 0 },
        };

        // 1) Mise à jour Redux local (addCard)
        dispatch(addCard({ background: currentScene.background, card: newCard }));

        // 2) État local
        const updatedScene = {
            ...currentScene,
            cards: [...currentScene.cards, newCard],
        };
        setCurrentScene(updatedScene);

        // 3) Mettre à jour la BDD (PUT /api/updateScene)
        dispatch(updateSceneThunk(updatedScene));
    };

    // ─────────────────────────────────────────────
    // Retirer un player / entité => removeCard => updateScene
    // ─────────────────────────────────────────────
    const removePlayerEntity = (cardId: number) => {
        if (!currentScene.background) return;

        dispatch(removeCard({ background: currentScene.background, cardId }));

        const updatedScene = {
            ...currentScene,
            cards: currentScene.cards.filter((c) => c.id !== cardId),
        };
        setCurrentScene(updatedScene);

        dispatch(updateSceneThunk(updatedScene));
    };

    // ─────────────────────────────────────────────
    // Ouvrir la page de rendu
    // ─────────────────────────────────────────────
    const openRenderPage = () => {
        window.open("/render", "_blank");
    };

    // Savoir s'il n'y a pas de scène sélectionnée
    const isSceneDefault =
        !currentScene.background &&
        !currentScene.music &&
        currentScene.cards.length === 0;

    // ─────────────────────────────────────────────
    // Rendu
    // ─────────────────────────────────────────────
    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* HEADER */}
            <Box flex="1" display="flex" alignItems="center" justifyContent="left">
                <Heading as="h1" size="lg" ml={4}>
                    Contrôle MJ
                </Heading>
            </Box>

            {/* CONTENU PRINCIPAL */}
            <Box display="flex" flex="8">
                {/* COLONNE GAUCHE */}
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

                            {/* TABLE JOUEURS */}
                            <TableContainer mt={5}>
                                <Table size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Joueurs</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {players.map((player, idx) => (
                                            <Tr key={idx}>
                                                <Td>{player.name}</Td>
                                                <Td>
                                                    <Button
                                                        colorScheme="blue"
                                                        onClick={() => addPlayerEntity(player)}
                                                    >
                                                        +
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            <Divider mt={5} mb={5} />

                            {/* TABLE ENTITÉS */}
                            <TableContainer mt={5}>
                                <Table size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Entités</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {entities.map((entity, idx) => (
                                            <Tr key={idx}>
                                                <Td>{entity.name}</Td>
                                                <Td>
                                                    <Button
                                                        colorScheme="blue"
                                                        onClick={() => addPlayerEntity(entity)}
                                                    >
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

                {/* COLONNE DROITE : AFFICHAGE SCÈNE SÉLECTIONNÉE */}
                <Box flex="1" display="flex" alignItems="center" justifyContent="center">
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
                                <Heading size="md">Scène en cours :</Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack divider={<StackDivider />} spacing={4}>
                                    <Box mb={4}>
                                        <Heading size="xs" textTransform="uppercase">
                                            Nom (background)
                                        </Heading>
                                        <Text pt={2} fontSize="sm">
                                            {currentScene.background}
                                        </Text>
                                    </Box>
                                    <Box mt={4} mb={4}>
                                        <Heading size="xs" textTransform="uppercase">
                                            Joueurs / Entités présents
                                        </Heading>
                                        <Table size="sm">
                                            <TableContainer>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Nom</Th>
                                                        <Th>PV</Th>
                                                        <Th>Suppr</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {currentScene.cards.length === 0 ? (
                                                        <Tr>
                                                            <Td colSpan={3}>
                                                                <Text fontSize="sm">
                                                                    Pas de joueurs ou entités présents
                                                                </Text>
                                                            </Td>
                                                        </Tr>
                                                    ) : (
                                                        currentScene.cards.map((card, index) => (
                                                            <Tr key={index}>
                                                                <Td>{card.identity.name}</Td>
                                                                <Td>
                                                                    {"HP" in card.identity ? card.identity.HP : "?"}
                                                                </Td>
                                                                <Td>
                                                                    <Button
                                                                        colorScheme="red"
                                                                        onClick={() => removePlayerEntity(card.id)}
                                                                    >
                                                                        -
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
