"use client";

import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

// Redux
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
    Scene,
    Card,
    getSceneThunk,         // POST /api/getScene
    updateCardPosition,
    updateSceneThunk,       // PUT /api/updateScene
} from "@/redux/features/sceneSlice";

import { getCampaignAPI, Campaign } from "@/redux/features/campaignSlice";
import {getPlayerAPI, Player} from "@/redux/features/playerSlice";

export default function RenderPage() {
    const dispatch = useAppDispatch();

    /**
     * Ici on définit "username" et "campaignName" en dur,
     * mais tu peux évidemment les récupérer via un param d'URL
     * ou tout autre moyen selon tes besoins
     */
    const username = "rdu";
    const campaignName = "Bloodborne";

    // 1) On récupère la liste de campagnes dans Redux
    const campaigns = useAppSelector((state) => state.campaign.campaigns);

    // 2) On cherche la campagne qui correspond (username, name)
    const currentCampaign: Campaign | undefined = campaigns.find(
        (c) => c.username === username && c.name === campaignName
    );

    // 3) On a aussi la liste de scènes en Redux
    const scenes = useAppSelector((state) => state.scene.scenes);

    const players = useAppSelector((state) => state.player.players);

    // 4) État local : la scène affichée
    const [currentScene, setCurrentScene] = useState<Scene>({
        background: "",
        music: "",
        cards: [],
    });

    /**
     * (A) Polling pour récupérer la liste de campagnes => /api/getCampaign
     *    On appelle un thunk getCampaignAPI(username: string),
     *    qui fait un POST avec {username} et renvoie campaignList.
     */
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getCampaignAPI("rdu"));
            dispatch(getPlayerAPI("Bloodborne"));
        }, 2000);

        return () => clearInterval(interval);
    }, [dispatch]);

    /**
     * (B) Dès qu'on a currentCampaign et qu'elle possède un champ `currentScene`,
     *     on appelle getSceneThunk(currentCampaign.currentScene) => POST /api/getScene
     */
    useEffect(() => {
        if (currentCampaign && currentCampaign.currentScene) {
            dispatch(getSceneThunk(currentCampaign.currentScene));
        }
    }, [dispatch, currentCampaign]);

    /**
     * (C) Synchroniser le state local `currentScene` avec la scène Redux
     *     trouvée par son background
     */
    useEffect(() => {
        if (!currentCampaign?.currentScene) return;
        const foundScene = scenes.find(
            (s) => s.background === currentCampaign.currentScene
        );
        if (foundScene && foundScene !== currentScene) {
            setCurrentScene(foundScene);
        }
    }, [scenes, currentCampaign, currentScene]);

    /**
     * (D) handleCardStop : quand on déplace une carte
     *     => on met à jour Redux (updateCardPosition) pour la position
     *     => on met à jour le state local
     *     => on envoie updateSceneThunk => PUT /api/updateScene
     */
    const handleCardStop = (
        e: DraggableEvent,
        data: DraggableData,
        cardId: number
    ) => {
        if (!currentScene.background) return;

        // 1) Mise à jour Redux => updateCardPosition
        dispatch(
            updateCardPosition({
                background: currentScene.background,
                cardId,
                position: { x: data.x, y: data.y },
            })
        );

        // 2) Mise à jour local
        const updatedCards = currentScene.cards.map((c) =>
            c.id === cardId ? { ...c, position: { x: data.x, y: data.y } } : c
        );
        const updatedScene: Scene = { ...currentScene, cards: updatedCards };
        setCurrentScene(updatedScene);

        // 3) Persister en BDD => PUT /api/updateScene
        dispatch(updateSceneThunk(updatedScene));
    };

    // Si aucune scène n'a de background => on affiche un message
    if (!currentScene.background) {
        return (
            <Box>
                <h2>Aucune scène sélectionnée</h2>
            </Box>
        );
    }

    // Rendu final de la scène (background + drag)
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
                const defaultX = card.position?.x ?? 100;
                const defaultY = card.position?.y ?? 100;

                return (
                    <Draggable
                        key={card.id}
                        defaultPosition={{ x: defaultX, y: defaultY }}
                        onStop={(e, data) => handleCardStop(e, data, card.id)}
                    >
                        <Box
                            position="absolute"
                            width="100px"
                            height="100px"
                            borderRadius="8px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            overflow="hidden"
                            cursor="grab"
                        >
                            {typeof card.identity === "number" ? (
                                <>
                                    {players.map((player: Player) => (
                                        player.id === card.identity ? (
                                            <>
                                                {"picture" in player && (
                                                    <Image
                                                        src={player.picture}
                                                        alt={player.name}
                                                        boxSize="100px"
                                                        objectFit="cover"
                                                    />
                                                )}
                                            </>
                                        ) : null
                                    ))}
                                </>
                            ) : (
                                <>
                                    {"picture" in card.identity && (
                                        <Image
                                            src={card.identity.picture}
                                            alt={card.identity.name}
                                            boxSize="100px"
                                            objectFit="cover"
                                        />
                                    )}
                                </>
                            )}
                        </Box>
                    </Draggable>
                );
            })}
        </Box>
    );
}
