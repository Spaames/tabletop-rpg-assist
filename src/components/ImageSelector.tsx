import { useState, useEffect } from 'react';
import { Box, Button, VStack, Text, Spinner } from '@chakra-ui/react';

interface ImageSelectorProps {
    username: string;
    campaignName: string;
    folder: string;
    onSelect: (image: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ username, campaignName, folder, onSelect }) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/listFiles?username=${username}&campaignName=${campaignName}&folder=${folder}`
                );
                const data = await response.json();
                if (response.ok) {
                    setImages(data.files);
                } else {
                    setError(data.error || 'Error fetching images');
                }
            } catch (err) {
                setError('Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [username, campaignName, folder]);

    return (
        <VStack spacing={4} align="start">
            {loading && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}
            {images.map(image => (
                <Box key={image}>
                    <Button
                        onClick={() => onSelect(image)}
                        variant="outline"
                        colorScheme="teal"
                        size="sm"
                    >
                        {image}
                    </Button>
                </Box>
            ))}
        </VStack>
    );
};

export default ImageSelector;
