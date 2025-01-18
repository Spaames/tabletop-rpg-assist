"use client";

import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { FaSkull } from "react-icons/fa";  // icône crâne


import {
    Scene,
    Card,
    getSceneThunk,
    updateCardPosition,
    updateSceneThunk,
} from "@/redux/features/sceneSlice";
import { getCampaignAPI, Campaign } from "@/redux/features/campaignSlice";
import { getPlayerAPI, Player } from "@/redux/features/playerSlice";
import { Entity } from "@/redux/features/entitySlice";

export default function RenderPage() {
    const dispatch = useAppDispatch();

    // user & campaign
    const username = "rdu";
    const campaignName = "Bloodborne";

    // Redux state
    const campaigns = useAppSelector((state) => state.campaign.campaigns);
    const scenes = useAppSelector((state) => state.scene.scenes);
    const players = useAppSelector((state) => state.player.players);
    const entities = useAppSelector((state) => state.entity.entities);

    // Trouver la bonne campagne
    const currentCampaign: Campaign | undefined = campaigns.find(
        (c) => c.username === username && c.name === campaignName
    );

    // Scene locale
    const [currentScene, setCurrentScene] = useState<Scene>({
        background: "",
        music: "",
        cards: [],
    });

    // Polling pour campaigns, players, etc.
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getCampaignAPI(username));
            dispatch(getPlayerAPI(campaignName));
            // dispatch(getEntityAPI(campaignName)) si tu as un thunk entité
        }, 2000);

        return () => clearInterval(interval);
    }, [dispatch, username, campaignName]);

    // Charger la scene quand currentCampaign.currentScene existe
    useEffect(() => {
        if (currentCampaign?.currentScene) {
            dispatch(getSceneThunk(currentCampaign.currentScene));
        }
    }, [dispatch, currentCampaign]);

    // Sync local scene
    useEffect(() => {
        if (!currentCampaign?.currentScene) return;
        const foundScene = scenes.find(
            (s) => s.background === currentCampaign.currentScene
        );
        if (foundScene && foundScene !== currentScene) {
            setCurrentScene(foundScene);
        }
    }, [scenes, currentCampaign, currentScene]);

    // Déplacement d'une carte => Redux + BDD
    const handleCardStop = (e: DraggableEvent, data: DraggableData, cardId: number) => {
        if (!currentScene.background) return;

        dispatch(
            updateCardPosition({
                background: currentScene.background,
                cardId,
                position: { x: data.x, y: data.y },
            })
        );

        // local
        const updatedCards = currentScene.cards.map((c) =>
            c.id === cardId ? { ...c, position: { x: data.x, y: data.y } } : c
        );
        const updatedScene: Scene = { ...currentScene, cards: updatedCards };
        setCurrentScene(updatedScene);

        // BDD
        dispatch(updateSceneThunk(updatedScene));
    };

    if (!currentScene.background) {
        return (
            <Box>
                <h2>Aucune scène sélectionnée</h2>
            </Box>
        );
    }

    return (
        <Box
            height="100vh"
            backgroundImage={`url(${currentScene.background})`}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            position="relative"
        >
            {currentScene.cards.map((card: Card) => {
                // Lecture de la position
                const x = card.position?.x ?? 0;
                const y = card.position?.y ?? 0;

                // On va distinguer Player vs. Entity
                let imageSrc = "";
                let imageAlt = "";
                let maxHP = 0;
                let currentHP = 0;

                if (typeof card.identity === "number") {
                    // => c'est un Player
                    const foundPlayer = players.find((p) => p.id === card.identity);
                    if (foundPlayer) {
                        imageSrc = foundPlayer.picture || "";
                        imageAlt = foundPlayer.name;
                        maxHP = foundPlayer.HP;
                        currentHP = foundPlayer.currentHealth;
                    }
                } else {
                    // => c'est une Entity
                    const entity = card.identity as Entity;
                    imageSrc = entity.picture || "";
                    imageAlt = entity.name;
                    maxHP = entity.HP;
                    // pour les entités, currentHealth est stocké dans card.currentHealth
                    currentHP = card.currentHealth || 0;
                }

                // Calcul de la barre de vie
                let lifePercent = 0;
                if (maxHP > 0) {
                    lifePercent = Math.round((currentHP / maxHP) * 100);
                    if (lifePercent < 0) lifePercent = 0;
                    if (lifePercent > 100) lifePercent = 100;
                }

                // On considère "mort" si lifePercent === 0
                const isDead = lifePercent === 0;

                return (
                    <Draggable
                        key={card.id}
                        position={{ x, y }}
                        onStop={(e, data) => handleCardStop(e, data, card.id)}
                    >
                        <Box
                            position="absolute"
                            width="100px"
                            height="110px"
                            cursor="grab"
                            // si PV = 0 => on grise la carte
                            filter={isDead ? "grayscale(100%)" : "none"}
                        >
                            {/* L'image */}
                            <Box
                                position="absolute"
                                top="0"
                                left="0"
                                width="100px"
                                height="100px"
                            >
                                {imageSrc ? (
                                    <Image
                                        src={imageSrc}
                                        alt={imageAlt}
                                        boxSize="100px"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Box bg="gray.300" width="100px" height="100px">
                                        {imageAlt}
                                    </Box>
                                )}
                            </Box>

                            {/* Barre de vie en bas */}
                            <Box
                                position="absolute"
                                bottom="0"
                                left="0"
                                right="0"
                                height="10px"
                                bg="red"
                            >
                                <Box
                                    width={`${lifePercent}%`}
                                    height="100%"
                                    bg="green"
                                    transition="width 0.2s linear"
                                />
                            </Box>

                            {/* Overlay "tête de mort" si mort */}
                            {isDead && (
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
                                    bg="rgba(255,0,0,0.2)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <FaSkull color="white" size="30px" />
                                </Box>
                            )}
                        </Box>
                    </Draggable>
                );
            })}
        </Box>
    );
}
