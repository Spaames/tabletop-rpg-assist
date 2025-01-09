import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Player } from "@/redux/features/playerSlice"
import { Entity} from "@/redux/features/entitySlice";
import {AppThunk} from "@/redux/store";

export interface Card {
    id: number;
    identity: Player | Entity;
    position: { x: number; y: number };
}

export interface Scene {
    background: string;
    music: string;
    cards: Card[];
}

interface SceneState {
    scenes: Scene[];
    loading: boolean;
    error: null | string;
}

const initialState: SceneState = {
    scenes: [],
    loading: false,
    error: null,
}

const sceneSlice = createSlice({
    name: "scene",
    initialState,
    reducers: {
        updateScene(state, action: PayloadAction<{ background: string; updatedData: Partial<Entity> }>) {
            const { background, updatedData } = action.payload;
            const sceneIndex = state.scenes.findIndex(scene => scene.background === background);
            if (sceneIndex !== -1) {
                state.scenes[sceneIndex] = {
                    ...state.scenes[sceneIndex],
                    ...updatedData,
                };
            }
        },
        start(state) {
            state.loading = true;
            state.error = null;
        },
        failure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        initSucess(state, action: PayloadAction<Scene[]>) {
            state.loading = false;
            state.error = null;
            state.scenes = action.payload;
        },
        addCard(state, action: PayloadAction<{ background: string; card: Card }>) {
            const { background, card } = action.payload;
            const scene = state.scenes.find(scene => scene.background === background);
            if (scene) {
                scene.cards.push(card);
            }
        },
        removeCard(state, action: PayloadAction<{ background: string; cardId: number }>) {
            const { background, cardId } = action.payload;
            const scene = state.scenes.find(scene => scene.background === background);
            if (scene) {
                scene.cards = scene.cards.filter(card => card.id !== cardId);
            }
        },
        updateCardPosition(state, action: PayloadAction<{ background: string; cardId: number; position: { x: number; y: number } }>) {
            const { background, cardId, position } = action.payload;
            const scene = state.scenes.find(scene => scene.background === background);
            if (scene) {
                const card = scene.cards.find(card => card.id === cardId);
                if (card) {
                    console.log(position.x, position.y);
                    card.position = { x: position.x, y: position.y }; // Mise à jour explicite
                }
            }
        }
    }
});

export const {
    start, failure, initSucess,
    updateScene, addCard, removeCard, updateCardPosition,
} = sceneSlice.actions;

export const initSceneThunk = (username: string, campaignName: string, folder: string): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch(`/api/listFiles?username=${username}&campagneName=${campaignName}&folder=${folder}`);
        console.log(`/api/listFiles?username=${username}&campagneName=${campaignName}&folder=${folder}`);

        if (!response.ok) {
            dispatch(failure("Echec récup scènes"));
        }

        const data = await response.json();

        if (!data.files || !Array.isArray(data.files)) {
            dispatch(failure("Format de réponse invalide"));
        }

        const scenes = data.files.map((file: string) => ({
            background: `/${username}/${campaignName}/${folder}/${file}`,
            music: "",
            cards: [],
        }));

        dispatch(initSucess(scenes));
    } catch (e) {
        console.log(e);
        dispatch(failure("echec thunk"));
    }
}

export default sceneSlice.reducer;