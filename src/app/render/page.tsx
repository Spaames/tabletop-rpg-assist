"use client";

import { Box } from "@chakra-ui/react";
import { useAppSelector } from "@/redux/hook";
import {useEffect, useState} from "react";

export default function RenderPage() {
    const [background, setBackground] = useState<string>("");

    const fetchCurrentBgAPI = async () => {
        try {
            const response = await fetch('/api/getCurrentBgImage');
            if (response.ok) {
                const data = await response.json();
                setBackground(data.background);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchCurrentBgAPI, 1000);

        return () => clearInterval(interval); // Nettoie l'intervalle lorsque le composant est démonté
    }, []);

    return (
        <Box
            height="100vh"
            backgroundImage={`url(${background})`}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
        >
            <h1>Page de Rendu</h1>
        </Box>
    );
}
