"use client";

import {Player, updatePlayer} from "@/redux/features/playerSlice";
import {
    Box,
    Button,
    Heading,
    Input,
    Table,
    TableContainer,
    Tbody,
    Td,
    Textarea,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useAppDispatch} from "@/redux/hook";

interface PlayerInventoryFormProps {
    playerData: Player;
}

const PlayerInventoryForm: React.FC<PlayerInventoryFormProps> = ({ playerData }) => {
    const dispatch = useAppDispatch();


    const [weapons, setWeapons] = useState(playerData.weapons || []);
    const [inventory, setInventory] = useState(playerData.inventory || []);

    useEffect(() => {
        const handleChangeWeapons = (field: keyof Player, value: { name: string; damage: string; special: string }[]) => {
            dispatch(updatePlayer({ name: playerData.name, updatedData: { [field]: value } }));
        };
        const handleChangeInventory = (field: keyof Player, value: { name: string; amount: string; description: string }[]) => {
            dispatch(updatePlayer({ name: playerData.name, updatedData: { [field]: value } }));
        };


        handleChangeWeapons('weapons', weapons);
        handleChangeInventory('inventory', inventory);
    }, [dispatch, weapons, inventory, playerData.name]);

    const handleAddWeapon = () => {
        const newWeapon = { name: "", damage: "", special: "" };
        setWeapons([...weapons, newWeapon]);
    };

    const handleRemoveWeapon = (index: number) => {
        const updatedWeapons = weapons.filter((_, i) => i !== index);
        setWeapons(updatedWeapons);
    };

    const handleWeaponChange = (index: number, field: string, value: string) => {
        const updatedWeapons = [...weapons];
        updatedWeapons[index] = { ...updatedWeapons[index], [field]: value };
        setWeapons(updatedWeapons);
    };

    const handleAddInventoryItem = () => {
        const newItem = { name: "", amount: "", description: "" };
        setInventory([...inventory, newItem]);
    };

    const handleRemoveInventoryItem = (index: number) => {
        const updatedInventory = inventory.filter((_, i) => i !== index);
        setInventory(updatedInventory);
    };

    const handleInventoryChange = (index: number, field: string, value: string | number) => {
        const updatedInventory = [...inventory];
        updatedInventory[index] = { ...updatedInventory[index], [field]: value };
        setInventory(updatedInventory);
    };

    return (
        <Box>
            {/* Weapons Section */}
            <Heading size="md" mb={1}>
                Weapons
            </Heading>
            <TableContainer>
                <Table size={"sm"}>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Damage</Th>
                            <Th>Special</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {weapons && weapons.length > 0 ? (
                            weapons.map((weapon, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <Input
                                            size="sm"
                                            value={weapon.name}
                                            onChange={(e) =>
                                                handleWeaponChange(index, "name", e.target.value)
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        <Input
                                            size="sm"
                                            w={"80px"}
                                            value={weapon.damage}
                                            onChange={(e) =>
                                                handleWeaponChange(index, "damage", e.target.value)
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        <Textarea
                                            size="sm"
                                            value={weapon.special}
                                            onChange={(e) =>
                                                handleWeaponChange(index, "special", e.target.value)
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => handleRemoveWeapon(index)}
                                        >
                                            Delete
                                        </Button>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={4}>No weapons</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            <Button mt={2} size="sm" colorScheme="gray" onClick={handleAddWeapon}>
                Add Weapon
            </Button>

            {/* Inventory Section */}
            <Heading size="md" mt={4} mb={1}>
                Inventory
            </Heading>
            <TableContainer>
                <Table size={"sm"}>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Amount</Th>
                            <Th>Description</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {inventory && inventory.length > 0 ? (
                            inventory.map((item, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <Input
                                            size="sm"
                                            value={item.name}
                                            onChange={(e) =>
                                                handleInventoryChange(index, "name", e.target.value)
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        <Input
                                            size="sm"
                                            w={"80px"}
                                            value={item.amount}
                                            onChange={(e) =>
                                                handleInventoryChange(
                                                    index,
                                                    "amount",
                                                    e.target.value
                                                )

                                        }
                                        />
                                    </Td>
                                    <Td>
                                        <Textarea
                                            size="sm"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleInventoryChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => handleRemoveInventoryItem(index)}
                                        >
                                            Delete
                                        </Button>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={4}>No inventory items</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            <Button mt={2} size="sm" colorScheme="gray" onClick={handleAddInventoryItem}>
                Add Item
            </Button>
        </Box>
    );
};

export default PlayerInventoryForm;
