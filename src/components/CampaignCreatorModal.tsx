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
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {createCampaignAPI} from "@/redux/features/campaignSlice";

const CampaignCreatorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({
        campaignName: '',
    });
    const dispatch = useAppDispatch();
    const username = useAppSelector((state) => state.auth.user.username);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        dispatch(createCampaignAPI(formData.campaignName, username));
        console.log('Form submitted:', formData, username);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a New Campaign</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired mb={4}>
                        <FormLabel>Campaign Name</FormLabel>
                        <Input
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={handleChange}
                            placeholder="Enter campaign name"
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

export default CampaignCreatorModal;
