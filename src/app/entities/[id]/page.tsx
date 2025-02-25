"use client";

import {
    Box,
    Button,
    Image,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Textarea,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import React, {useEffect, useState} from "react";
import {Entity, getEntityAPI, updateEntitiesAPI} from "@/redux/features/entitySlice";
import ImageSelectorModal from "@/components/ImageSelectorModal";

export default function Page({ params }: { params: { id: string } }) {
    const entitiesStore = useAppSelector((state) =>
        state.entity.entities.filter((entity) => entity.campaign === params.id) || []
    );
    const dispatch = useAppDispatch();
    const [entities, setEntities] = useState<Entity[]>(entitiesStore || []);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Contrôle de la modale
    const { isOpen, onOpen, onClose } = useDisclosure(); // Contrôle de la modale d'aperçu
    const campaignName = params.id;
    const username = useAppSelector((state) => state.auth.user.username);
    const [previewImage, setPreviewImage] = useState<string | null>(null); // Image à afficher en aperçu
    const [activeEntityIndex, setActiveEntityIndex] = useState<number | null>(null);

    useEffect(() => {
        if (campaignName) {
            dispatch(getEntityAPI(campaignName));
        }

    }, []);




    // Mise à jour d'un champ spécifique dans une entité
    const updateEntityField = <K extends keyof Entity>(
        index: number,
        field: K,
        value: Entity[K]
    ) => {
        const updatedEntities = [...entities];
        updatedEntities[index][field] = value;
        setEntities(updatedEntities);
    };

    const handleImageSelect = (image: string) => {
        if (activeEntityIndex !== null) {
            const imagePath = `/${username}/${campaignName}/entities/${image}`;
            // Met à jour l'image de l'entité active
            updateEntityField(activeEntityIndex, "picture", imagePath);
            setActiveEntityIndex(null); // Réinitialise l'entité active
        }
        setIsModalOpen(false); // Ferme la modale
    };


    // Ajout d'une nouvelle entité
    const addEntity = () => {
        const newEntity: Entity = {
            campaign: params.id,
            name: "",
            picture: "",
            HP: 0,
            currentHealth: 0,
            STR: 0,
            DEX: 0,
            INT: 0,
            DEF: 0,
            damage: "",
            particularity: "",
        };
        setEntities([...entities, newEntity]);
    };

    // Suppression d'une entité
    const removeEntity = (index: number) => {
        const updatedEntities = entities.filter((_, i) => i !== index);
        setEntities(updatedEntities);
    };

    const updateEntities = () => {
        dispatch(updateEntitiesAPI(entities));

    }

    const handleImagePreview = (image: string) => {
        setPreviewImage(image);
        onOpen();
    };




    return (
        <Box>
            <Button colorScheme="blue" onClick={addEntity} mb={4} mr={4} isDisabled={isLoading}>
                Add Row
            </Button>
            <Button
                colorScheme="green"
                mb={4}
                isLoading={isLoading} // Chakra UI affiche un Spinner dans le bouton
                loadingText="Updating..."
                onClick={updateEntities}
            >
                Update
            </Button>
            <TableContainer>
                <Table size={"md"} variant={"simple"} width={"100%"}>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Img</Th>
                            <Th>HP</Th>
                            <Th>STR</Th>
                            <Th>DEX</Th>
                            <Th>INT</Th>
                            <Th>DEF</Th>
                            <Th>Damage</Th>
                            <Th>Particularities</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {entities.map((entity, index) => (
                            <Tr key={index}>
                                <Td>
                                    <Input
                                        size="md"
                                        type={"text"}
                                        w={"250px"}
                                        value={entity.name}
                                        onChange={(e) =>
                                            updateEntityField(index, "name", e.target.value)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Image
                                        src={entity.picture}
                                        alt="Entity Image"
                                        boxSize="100"
                                        borderRadius="md"
                                        objectFit="cover"
                                        border="1px solid gray"
                                        onClick={() => handleImagePreview(entity.picture)} // Aperçu en cliquant
                                        cursor="pointer" // Indique que c'est cliquable
                                    />
                                    <Button
                                        mt={4}
                                        colorScheme="teal"
                                        onClick={() => {
                                            setActiveEntityIndex(index); // Stocke l'index de l'entité
                                            setIsModalOpen(true); // Ouvre la modale
                                        }}
                                    >
                                        Select Character Image
                                    </Button>

                                    <ImageSelectorModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        username={username}
                                        campaignName={campaignName}
                                        folder={"entities"}
                                        onSelect={handleImageSelect}
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        size="md"
                                        type="text"
                                        w={"60px"}
                                        value={entity.HP}
                                        onChange={(e) =>
                                            updateEntityField(index, "HP", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        size="md"
                                        type="text"
                                        w={"60px"}
                                        value={entity.STR}
                                        onChange={(e) =>
                                            updateEntityField(index, "STR", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        size="md"
                                        type="text"
                                        w={"60px"}
                                        value={entity.DEX}
                                        onChange={(e) =>
                                            updateEntityField(index, "DEX", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        size="md"
                                        type="text"
                                        w={"60px"}
                                        value={entity.INT}
                                        onChange={(e) =>
                                            updateEntityField(index, "INT", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        size="md"
                                        type="text"
                                        w={"60px"}
                                        value={entity.DEF}
                                        onChange={(e) =>
                                            updateEntityField(index, "DEF", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        size="md"
                                        type="text"
                                        w={"200px"}
                                        value={entity.damage}
                                        onChange={(e) =>
                                            updateEntityField(index, "damage", e.target.value)
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Textarea
                                        size="md"
                                        typeof={"text"}
                                        value={entity.particularity}
                                        w={"400px"}
                                        onChange={(e) =>
                                            updateEntityField(index, "particularity", e.target.value)
                                        }
                                    >
                                    </Textarea>
                                </Td>
                                <Td>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => removeEntity(index)}
                                        isDisabled={isLoading} // Empêcher la suppression en cas de chargement
                                    >
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Modale d'aperçu */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        {previewImage && (
                            <Image
                                src={previewImage}
                                alt="Preview"
                                borderRadius="md"
                                objectFit="contain"
                                maxW="100%"
                                maxH="80vh"
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme="blue">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    );
}
