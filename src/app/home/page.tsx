'use client';

import React, {useEffect, useState} from 'react';
import {Alert, AlertIcon, Box, Button, Heading, Spinner, Text} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {useRouter} from "next/navigation";
import CampaignCreatorModal from "@/components/CampaignCreatorModal";
import {getCampaignAPI} from "@/redux/features/campaignSlice";
import Link from "next/link";

const Page = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isModalOpen, setModalOpen] = useState(false);
    const campaignListStore = useAppSelector((state) => state.campaign.campaigns);

    useEffect(() => {
        if (!isModalOpen) {
            dispatch(getCampaignAPI(user.username));
        }
    }, [isModalOpen, user.username, dispatch]);

    const handleLogout = async () => {
        router.push('/logout');
    }

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Heading as="h1" size="lg">
                    You are not logged in :(
                </Heading>
            </Box>
        );
    }

    return (
        <Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                p={4}
            >
                <Heading as="h1" size="lg" mb={10}>
                    HOME
                </Heading>
                <Text fontSize="xl" p={4}>{user.username.toUpperCase()}&#39;s campaign :</Text>
                {campaignListStore && campaignListStore.length > 0 && (
                    [...campaignListStore].reverse().map((campaign, index) => (
                        campaign && campaign.name ? (
                            <Link key={index} href={`/campaign/${campaign.name}`} passHref>
                                <Button
                                    variant="outline"
                                    mb={3}
                                >
                                    {campaign.name}
                                </Button>
                            </Link>
                        ) : null
                    ))
                )}


                <Button onClick={openModal}>+ Campaign Creator +</Button>
                <Button colorScheme="red" onClick={handleLogout} size="md" p={4} mt={4}>Logout</Button>
            </Box>

            <CampaignCreatorModal isOpen={isModalOpen} onClose={closeModal} />
        </Box>
    );
};

export default Page;
