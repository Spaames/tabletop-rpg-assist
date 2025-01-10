"use client";

import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {Scene, Card, updateCardPosition} from "@/redux/features/sceneSlice";
import Draggable from 'react-draggable';
import { DraggableEvent, DraggableData } from 'react-draggable';
import {useAppDispatch, useAppSelector} from "@/redux/hook";


export default function RenderPage() {
    const [currentScene, setCurrentScene] = useState<Scene>({ background: "", music: "", cards: [] });
    const dispatch = useAppDispatch();

    const cardsStore = useAppSelector((state) => state.scene.scenes);

    // Récupération des données depuis l'API
    const fetchCurrentSceneAPI = async () => {
        try {
            const response = await fetch('/api/getCurrentScene');
            if (response.ok) {
                const data = await response.json();
                setCurrentScene(data.scene);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchCurrentSceneAPI, 1000);
        return () => clearInterval(interval);
    }, []);

    // Gestion du déplacement d'une carte
    const handleCardStop = (e: DraggableEvent, data: DraggableData, cardId: number) => {
        console.log('Position finale :', data.x, data.y);

        // Mise à jour dans Redux
        dispatch(updateCardPosition({
            background: currentScene.background,
            cardId,
            position: { x: data.x, y: data.y }
        }));

        // Mise à jour dans l'état local pour affichage immédiat
        setCurrentScene(prevScene => ({
            ...prevScene,
            cards: prevScene.cards.map(card =>
                card.id === cardId
                    ? { ...card, position: { x: data.x, y: data.y } }
                    : card
            ),
        }));

        // Sauvegarde côté API
        saveScenePositions(
            currentScene.cards.map(card =>
                card.id === cardId
                    ? {...card, position: {x: data.x, y: data.y}}
                    : card
            )
        );
        console.log(cardsStore);
     };


    // Sauvegarde des positions dans l'API
    const saveScenePositions = async (cards: Card[]) => {
        try {
            await fetch('/api/getCurrentScene', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scene: { ...currentScene, cards } })
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des positions:', error);
        }
    };

    return (
        <Box
            height="100vh"
            backgroundImage={`url(${currentScene.background})`}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            position="relative"
        >
            {/* Affichage des cartes déplaçables */}
            {currentScene.cards.map((card: Card) => (
                <Draggable
                    key={card.id}
                    grid={[50, 50]} // Grille pour le déplacement
                    defaultPosition={{
                        x: card.position?.x || window.innerWidth - 120,
                        y: card.position?.y || window.innerHeight - 120,
                    }}
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
                        {('picture' in card.identity) && (
                            <Image
                                src={card.identity.picture}
                                alt={card.identity.name}
                                boxSize="100px"
                                objectFit="cover"
                            />
                        )}
                    </Box>
                </Draggable>

            ))}
        </Box>
    );
}
