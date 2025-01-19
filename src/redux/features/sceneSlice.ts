import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@/redux/store";
import {Entity} from "@/redux/features/entitySlice";

export interface Card {
    id: number;
    identity:  number | Entity
    position: { x: number; y: number };
    currentHealth: number;
    INIT: number;
    isActive: boolean;
}

export interface Scene {
    background: string;
    music: string;
    cards: Card[];
    isFighting: boolean;
    fightingOrder: number[];
}

interface SceneState {
    scenes: Scene[];
    loading: boolean;
    error: string | null;
    selectedBackground: string | null;
}

const initialState: SceneState = {
    scenes: [],
    loading: false,
    error: null,
    selectedBackground: null,
};

const sceneSlice = createSlice({
    name: "scene",
    initialState,
    reducers: {
        start(state) {
            state.loading = true;
            state.error = null;
        },
        failure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        success(state) {
            state.loading = false;
            state.error = null;
        },
        setAllScenes(state, action: PayloadAction<Scene[]>) {
            state.scenes = action.payload;
        },
        setOneScene(state, action: PayloadAction<Scene>) {
            const updatedScene = action.payload;
            const index = state.scenes.findIndex(
                (scene) => scene.background === updatedScene.background
            );
            if (index === -1) {
                //si ça existe pas on l'ajoute
                state.scenes.push(updatedScene);
            } else {
                //sinon on remplace
                state.scenes[index] = updatedScene;
            }
        },
        addCard(state, action: PayloadAction<{ background: string, card: Card }>) {
            const { background, card } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (scene) {
                scene.cards.push(card);
            }
        },
        removeCard(state, action: PayloadAction<{ background: string; cardId: number }>) {
            const { background, cardId } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (scene) {
                scene.cards = scene.cards.filter((c) => c.id !== cardId);
            }
        },
        updateCardPosition(state, action: PayloadAction<{ background: string; cardId: number; position: { x: number; y: number }; }>) {
            const { background, cardId, position } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (scene) {
                const card = scene.cards.find((c) => c.id === cardId);
                if (card) {
                    card.position = position;
                }
            }
        },
        updateCardCurrentHealth(state, action: PayloadAction<{ background: string; cardId: number, currentHealth: number }>) {
            const { background, cardId, currentHealth } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (scene) {
                const card = scene.cards.find((c) => c.id === cardId);
                if (card) {
                    card.currentHealth = currentHealth;
                }
            }
        },
        selectBackground: (state, action: PayloadAction<string>) => {
            state.selectedBackground = action.payload;
        },
        startCombat(state, action: PayloadAction<{ background: string }>) {
            const { background } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (!scene) return;

            scene.isFighting = true;

            // On désactive toutes les cartes
            scene.cards.forEach((card) => { card.isActive = false });

            // On active la première carte
            if (scene.fightingOrder.length > 0) {
                const firstCardId = scene.fightingOrder[0];
                const firstCard = scene.cards.find((c) => c.id === firstCardId);
                if (firstCard) {
                    firstCard.isActive = true;
                }
            }
        },
        endCombat(
            state,
            action: PayloadAction<{ background: string }>
        ) {
            const { background } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (!scene) return;

            scene.isFighting = false;
            // On peut tout désactiver quand le combat se termine
            scene.cards.forEach((card) => (card.isActive = false));
        },
        setFigtingOrder(state, action: PayloadAction<{ background: string; fightingOrder: number[] }>) {
            const { background, fightingOrder } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (!scene) return;

            scene.fightingOrder = fightingOrder;
        },
        nextTurn(
            state,
            action: PayloadAction<{ background: string }>
        ) {
            const { background } = action.payload;
            const scene = state.scenes.find((s) => s.background === background);
            if (!scene) return;

            // Si pas en combat ou pas de fightingOrder, on ne fait rien
            if (!scene.isFighting || scene.fightingOrder.length === 0) {
                return;
            }

            // 1) On cherche QUI est actuellement isActive
            let currentIndex = scene.fightingOrder.findIndex((cardId) => {
                const card = scene.cards.find((c) => c.id === cardId);
                return card?.isActive === true;
            });

            // 2) Si personne n'est encore actif (par ex. initialisation), on active la 1ère carte
            if (currentIndex === -1) {
                currentIndex = 0;
                scene.cards.forEach((c) => (c.isActive = false));
                const firstCard = scene.cards.find(
                    (c) => c.id === scene.fightingOrder[0]
                );
                if (firstCard) firstCard.isActive = true;
                return;
            }

            // 3) Désactiver la carte actuelle
            const oldCard = scene.cards.find(
                (c) => c.id === scene.fightingOrder[currentIndex]
            );
            if (oldCard) oldCard.isActive = false;

            // 4) Incrémenter l'index; si on dépasse la taille du tableau, on boucle à 0
            let nextIndex = currentIndex + 1;
            if (nextIndex >= scene.fightingOrder.length) {
                nextIndex = 0;
            }

            // 5) Activer la carte suivante
            const nextCard = scene.cards.find(
                (c) => c.id === scene.fightingOrder[nextIndex]
            );
            if (nextCard) nextCard.isActive = true;
        },
    },
});

export const {
    start,
    failure,
    success,
    setAllScenes,
    setOneScene,
    addCard,
    removeCard,
    updateCardPosition,
    selectBackground,
    updateCardCurrentHealth,
    startCombat,
    endCombat,
    setFigtingOrder,
    nextTurn
} = sceneSlice.actions;

export default sceneSlice.reducer;

// ─────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────

/**
 * Récupère TOUTES les scènes (GET /api/scenes)
 */
export const getAllSceneThunk = (): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const res = await fetch("/api/getScenes", { method: "GET" });
        if (!res.ok) {
            dispatch(failure("error while fetching scenes"));
            return;
        }
        const data = await res.json();
        dispatch(setAllScenes(data.scenes));
        dispatch(success());
    } catch (err) {
        console.log(err);
        dispatch(failure("error while fetching scenes (try)"));
    }
};

/**
 * Récupère UNE scène via POST /api/getScene
 * Body JSON : { background }
 *
 * background => ex: "/rdu/Bloodborne/scenes/xx"
 */
export const getSceneThunk = (background: string): AppThunk => async (dispatch) => {
    try {
        dispatch(start());

        const response = await fetch("/api/getScene", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ background }),
        });

        if (!response.ok) {
            dispatch(failure("Error while fetching one scene"));
            return;
        }

        const data = await response.json();
        if (!data.scene) {
            dispatch(failure("No scene found in response"));
            return;
        }

        dispatch(setOneScene(data.scene));
        dispatch(success());
    } catch (err) {
        console.error(err);
        dispatch(failure("Error while fetching one scene (try/catch)"));
    }
};


/**
 * Met à jour ou crée une scène via PUT /api/updateScene
 * Body JSON : { background, music, cards }
 */
export const updateSceneThunk = (scene: Scene): AppThunk => async (dispatch) => {
    try {
        dispatch(start());

        // PUT /api/updateScene
        const response = await fetch("/api/updateScene", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scene),
        });

        if (!response.ok) {
            dispatch(failure("error while updating scene"));
            return;
        }

        const data = await response.json();
        if (!data.scene) {
            dispatch(failure("no scene found after update"));
            return;
        }

        dispatch(setOneScene(data.scene));
        dispatch(success());
    } catch (err) {
        console.error(err);
        dispatch(failure("error while updating scene (try/catch)"));
    }
};

export const nextTurnThunk = (background: string): AppThunk => async (
    dispatch,
    getState
) => {
    dispatch(nextTurn({ background }));
    // Pour persister les changements (mise à jour isActive),
    // on récupère la scène en question, et on la renvoie à updateSceneThunk.
    const state = getState();
    const scene = state.scene.scenes.find((s) => s.background === background);
    if (scene) {
        // Re-utilise le PUT /api/updateScene déjà existant
        dispatch(updateSceneThunk(scene));
    }
};