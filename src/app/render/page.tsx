"use client";

import { Box } from "@chakra-ui/react";
import { useAppSelector } from "@/redux/hook";

export default function RenderPage() {
    const background = useAppSelector((state) => state.game.background);

    // Encoder l'URL, y compris l'apostrophe
    const encodedBackground = encodeURI(background);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            backgroundImage={`url(${encodedBackground})`} // Appliquer l'URL encodée
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
        >
            <h1 style={{ color: "white" }}>Page de rendu</h1>
        </Box>
    );
}
