import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Player} from "@/redux/features/playerSlice";
import {Entity} from "@/redux/features/entitySlice";

interface GameState {
    id: number | null;
    background: string;
    players : Player[];
    entities : Entity[];
    music: string; //à changer en fonction du besoin
    //comment je gère une sauvegarde des positions
    loading: boolean;
    error: null | string;
}

const initialState: GameState = {
    id: null,
    background: "",
    players: [],
    entities: [],
    music: "",
    loading: false,
    error: null,
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
    }
});

export const {
} = gameSlice.actions;

export default gameSlice.reducer;