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
        getSceneSuccess(state, action: PayloadAction<Scene>) {
            const updatedScene = action.payload;
            const index = state.scenes.findIndex(scene => scene.background === updatedScene.background);

            if (index !== -1) {
                state.scenes[index] = updatedScene;
            }
        },
        getAllSceneSuccess(state, action: PayloadAction<Scene[]>) {
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
                    card.position = { x: position.x, y: position.y }; // Mise à jour explicite
                    console.log(JSON.parse(JSON.stringify(card.position)));
                }
            }
        }
    }
});

export const {
    start, failure, initSucess, getSceneSuccess, getAllSceneSuccess,
    updateScene, addCard, removeCard, updateCardPosition,
} = sceneSlice.actions;

//init les scenes basés sur ce qui est présent dans le dossier d'image, puis l'injecte dans le store
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
        dispatch(failure("echec try thunk"));
    }
}

//récupère les infos d'une scene précise
export const getSceneThunk = (background: string): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch('/api/getScene', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({background}),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(getSceneSuccess(data.scene));
        } else {
            dispatch(failure("Echec getScene thunk"));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Echec try getScene thunk"));
    }
}

//récupère toutes les scenes en base
export const getAllSceneThunk = (): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch('/api/getScenes', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(getAllSceneSuccess(data.scenes));
        } else {
            dispatch(failure("Echec getAllSceneThunk"));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Echec try getAllSceneThunk"));
    }
}

export const updateSceneThunk = (scene: Scene): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        //vrifier si la scène existe en base
        const fetchResponse = await fetch('/api/getScene', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ background: scene.background }),
        });

        const fetchData = await fetchResponse.json();

        if (fetchResponse.ok && fetchData.scene) {
            //la scène existe, on la met à jour
            const updateResponse = await fetch('/api/updateScene', {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scene),
            });

            if (updateResponse.ok) {
                dispatch(getSceneSuccess(scene)); // Met à jour le store Redux
            } else {
                dispatch(failure("Échec de la mise à jour de la scène"));
            }
        } else {
            //La scène n'existe pas, on la crée
            const createResponse = await fetch('/api/createScene', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scene),
            });

            if (createResponse.ok) {
                dispatch(getSceneSuccess(scene)); // Met à jour le store Redux
            } else {
                dispatch(failure("Échec de la création de la scène"));
            }
        }
    } catch (error) {
        console.error(error);
        dispatch(failure("Erreur lors de la mise à jour ou de la création de la scène"));
    }
};


export default sceneSlice.reducer;