"use client"

import {Player, updatePlayer} from "@/redux/features/playerSlice";
import React from "react";
import {Box, Heading, Textarea} from "@chakra-ui/react";
import {useAppDispatch} from "@/redux/hook";

interface PlayerAbilitiesFormProps {
    playerData: Player
}

const PlayerAbilitiesForm: React.FC<PlayerAbilitiesFormProps> = ({playerData}) => {
    const dispatch = useAppDispatch();

    const handleChange = (field: keyof Player, value: string | number) => {
        dispatch(updatePlayer({ name: playerData.name, updatedData: { [field]: value } }));
    };

    if (!playerData) {
        return null;
    }

    return (
        <Box>
            <Heading size="md" mb={1}>Bonus</Heading>
            <Textarea
                typeof="text"
                value={playerData.bonus}
                onChange={(e) => handleChange("bonus", e.target.value)}
            />

            <Heading size="md" mt={4} mb={1}>Malus</Heading>
            <Textarea
                typeof="text"
                value={playerData.malus}
                onChange={(e) => handleChange("malus", e.target.value)}
            />

            <Heading size="md" mt={4} mb={1}>Abilities</Heading>
            <Textarea
                typeof="text"
                value={playerData.abilities}
                onChange={(e) => handleChange("abilities", e.target.value)}
            />
        </Box>
    )
}

export default PlayerAbilitiesForm;