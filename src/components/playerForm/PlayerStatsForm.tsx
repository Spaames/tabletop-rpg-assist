"use client"

import {Player, updatePlayer} from "@/redux/features/playerSlice";
import {Box, Flex, Heading, Input, Text} from "@chakra-ui/react";
import React from "react";
import {displayMod, getModifier} from "@/utils/functions";
import {useAppDispatch} from "@/redux/hook";

interface PlayerStatsFormProps {
    playerData: Player
}

const PlayerStatsForm: React.FC<PlayerStatsFormProps> = ({playerData}) => {
    const dispatch = useAppDispatch();

    const handleChange = (field: keyof Player, value: string | number) => {
        dispatch(updatePlayer({ name: playerData.name, updatedData: { [field]: value } }));
        //prends en compte si c'est la vie : currentHealth est égale à la vie max hors game
        if (field === "HP") {
            if(typeof value === "number") {
                dispatch(updatePlayer({ name: playerData.name, updatedData: { currentHealth: value } }));
            }
        }
    };

    if (!playerData) {
        return null;
    }

    return (
        <Box>
            <Heading size={"md"} mb={1}>Health</Heading>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={2}>HP: </Text>
                <Input
                    size={"sm"}
                    w={"60px"}
                    mr={5}
                    type="number"
                    value={playerData.HP}
                    onChange={(e) => handleChange('HP', parseInt(e.target.value))}
                />
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={2}>HD: </Text>
                <Input
                    size={"sm"}
                    w={"60px"}
                    mr={5}
                    type={"text"}
                    value={playerData.HD}
                    onChange={(e) => handleChange('HD', e.target.value)}
                />
            </Flex>

            <Heading size="md" mt={4} mb={1}>Attributes</Heading>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={2}>STR: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={2}
                    type="number"
                    value={playerData.STR}
                    onChange={(e) => handleChange('STR', parseInt(e.target.value))}
                />
                <Text>{displayMod(getModifier(playerData.STR))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={2}>DEX: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={2}
                    type="number"
                    value={playerData.DEX}
                    onChange={(e) => handleChange('DEX', parseInt(e.target.value))}
                />
                <Text>{displayMod(getModifier(playerData.DEX))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={1}>CON: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={2}
                    type="number"
                    value={playerData.CON}
                    onChange={(e) => handleChange('CON', parseInt(e.target.value))}
                />
                <Text>{displayMod(getModifier(playerData.CON))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={3}>INT: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={2}
                    type="number"
                    value={playerData.INT}
                    onChange={(e) => handleChange('INT', parseInt(e.target.value))}
                />
                <Text>{displayMod(getModifier(playerData.INT))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={2}>WIS: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={2}
                    type="number"
                    value={playerData.WIS}
                    onChange={(e) => handleChange('WIS', parseInt(e.target.value))}
                />
                <Text>{displayMod(getModifier(playerData.WIS))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={1}>CHA: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={2}
                    type="number"
                    value={playerData.CHA}
                    onChange={(e) => handleChange('CHA', parseInt(e.target.value))}
                />
                <Text>{displayMod(getModifier(playerData.CHA))}</Text>
            </Flex>


            <Heading size={"md"} mt={4} mb={1}>Fight</Heading>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text mr={1}>DEF: </Text>
                <Input
                    size={"sm"}
                    w={"40px"}
                    mr={5}
                    type="number"
                    value={playerData.DEF}
                    onChange={(e) => handleChange('DEF', parseInt(e.target.value))}
                />
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text>CAC: {displayMod(getModifier(playerData.STR))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text>DIST: {displayMod(getModifier(playerData.DEX))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text>MAGI: {displayMod(getModifier(playerData.INT))}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} mb={1}>
                <Text>INTI: {playerData.DEX}</Text>
            </Flex>
        </Box>
    )
}




export default PlayerStatsForm;