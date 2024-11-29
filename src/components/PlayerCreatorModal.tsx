'use client';

import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import {useAppDispatch} from "@/redux/hook";
import {createPlayerAPI} from "@/redux/features/playerSlice"

const PlayerCreatorModal = ({ isOpen, onClose, campaignName }: { isOpen: boolean; onClose: () => void; campaignName: string }) => {
    const [formData, setFormData] = useState({
        playerName: '',
    });
    const dispatch = useAppDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const newPlayer = {
            name: formData.playerName,
            HP: 0,
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0,
            DEF: 0,
            weapons: [
                {
                    name: "",
                    damage: "",
                    special: "",
                },
            ],
            abilities: [
                {
                    category: "",
                    description: "",
                },
            ],
            inventory: [
                {
                    category: "",
                    description: "",
                    amount: 0,
                },
            ],
            picture: "",
            campaign: campaignName,
        }
        dispatch(createPlayerAPI(newPlayer));
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a New Player for {campaignName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired mb={4}>
                        <FormLabel>Player Name</FormLabel>
                        <Input
                            name="playerName"
                            value={formData.playerName}
                            onChange={handleChange}
                            placeholder="Enter player name"
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Create
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PlayerCreatorModal;
