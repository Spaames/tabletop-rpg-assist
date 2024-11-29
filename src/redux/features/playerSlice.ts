import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";

export interface Player {
    name: string;
    HP: number;
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
    DEF: number;
    weapons: {name: string, damage: string, special: string}[];
    abilities: {category: string, description: string}[];
    inventory: {category: string, description: string, amount: number}[];
    picture?: string;
    campaign: string;
};

interface PlayerState {
    players: Player[];
    loading: boolean;
    error: null | string;
};

const initialState: PlayerState = {
    players: [],
    loading: false,
    error: null,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        start(state) {
            state.loading = true;
            state.error = null;
        },
        createSuccess(state, action: PayloadAction<Player>) {
            state.players.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        getSuccess(state, action: PayloadAction<Player[]>) {
            state.players = action.payload;
            state.loading = false;
            state.error = null;
        },
        failure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    start, failure,
    createSuccess, getSuccess
} = playerSlice.actions;

export const createPlayerAPI = (player: Player): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/createPlayer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(createSuccess(data.player));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while creating player"));
    }
}

export const getPlayerAPI = (campaign: string): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/getPlayer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({campaign: campaign}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(getSuccess(data.playerList));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while getting campaign"));
    }
}


export default playerSlice.reducer;