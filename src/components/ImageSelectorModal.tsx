import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    Text,
} from "@chakra-ui/react";

interface ImageSelectorModalProps {
    isOpen: boolean; // Contrôle l'ouverture de la modale
    onClose: () => void; // Fonction pour fermer la modale
    username: string; // Nom d'utilisateur
    campaignName: string; // Nom de la campagne
    folder: string; // Sous-dossier pour les images (e.g., "players")
    onSelect: (image: string) => void; // Fonction appelée lors de la sélection d'une image
}

const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   username,
                                                                   campaignName,
                                                                   folder,
                                                                   onSelect,
                                                               }) => {
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch les images disponibles
        const fetchImages = async () => {
            try {
                const response = await fetch(
                    `/api/listFiles?username=${username}&campagneName=${campaignName}&folder=${folder}`
                );
                const data = await response.json();
                if (response.ok) {
                    setAvailableImages(data.files);
                } else {
                    setError(data.error || 'Error fetching images');
                }
            } catch (err) {
                setError('Failed to fetch images');
            }
        };

        if (isOpen) {
            fetchImages();
        }
    }, [isOpen, username, campaignName, folder]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select an Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {error && <Text color="red.500">{error}</Text>}
                    <VStack align="start" spacing={3}>
                        {availableImages.map((image) => (
                            <Button
                                key={image}
                                variant="outline"
                                colorScheme="teal"
                                onClick={() => {
                                    onSelect(image);
                                    onClose();
                                }}
                            >
                                {image}
                            </Button>
                        ))}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageSelectorModal;
