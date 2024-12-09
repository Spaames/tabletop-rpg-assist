"use client"

import {Box, Table, TableContainer, Th, Thead} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {useState} from "react";

export default function Page({ params }: { params: {id: string} }) {
    const dispatch = useAppDispatch();
    const campaign = useAppSelector((state) => state.campaign.campaigns.find(campaign => campaign.name === params.id));
    const [entities, setEntities] = useState([]);


    return (
        <Box>
            <TableContainer>
                <Table size={"md"}>
                    <Thead>
                        <Th>Name</Th>
                        <Th>Img</Th>
                        <Th>HP</Th>
                        <Th>Att Cac</Th>
                        <Th>Att Dist</Th>
                        <Th>Att Mag</Th>
                        <Th>Defense</Th>
                        <Th>Damage</Th>
                        <Th>Particularities</Th>
                    </Thead>
                </Table>
            </TableContainer>
        </Box>
    )
}