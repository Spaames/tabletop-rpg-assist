import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";

export interface Player {
    id : number;
    name: string;
    lvl: number;
    sex: string;
    age: number;
    height: number;
    weight: number;
    race: string;
    class: string;
    HP: number;
    currentHealth: number;
    HD: string;
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
    DEF: number;
    INIT: number;
    weapons: {name: string, damage: string, special: string}[];
    abilities: string;
    bonus: string;
    malus: string;
    specialRules: string;
    inventory: {name: string, amount: string, description: string}[];
    picture: string;
    campaign: string;
}

interface PlayerState {
    players: Player[];
    loading: boolean;
    error: null | string;
}

const initialState: PlayerState = {
    players: [],
    loading: false,
    error: null,
}

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
        getAllSuccess(state, action: PayloadAction<Player[]>) {
            state.players = action.payload;
            state.loading = false;
            state.error = null;
        },
        getOneSuccess(state, action: PayloadAction<Player>) {
            const updatedPlayer = action.payload;
            const index = state.players.findIndex(
                (player) => player.id === updatedPlayer.id
            );
            if (index === -1) {
                state.players.push(updatedPlayer);
            } else {
                state.players[index] = updatedPlayer;
            }
        },
        updateSuccess(state, action: PayloadAction<Player>) {
            const index = state.players.findIndex(player => player.name === action.payload.name);
            if (index != -1) {
                state.players[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        failure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updatePlayer(state, action: PayloadAction<{ name: string; updatedData: Partial<Player> }>) {
            const { name, updatedData } = action.payload;
            const playerIndex = state.players.findIndex((player) => player.name === name);
            if (playerIndex !== -1) {
                state.players[playerIndex] = {
                    ...state.players[playerIndex],
                    ...updatedData,
                };
            }
        },
    },
});

export const {
    start, failure,
    createSuccess, getAllSuccess, updateSuccess,
    updatePlayer,
    getOneSuccess,
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
        const response = await fetch("/api/getPlayers", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({campaign: campaign}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(getAllSuccess(data.playerList));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while getting players"));
    }
}

export const getOnePlayerThunk = (id: number): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/getPlayer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(getOneSuccess(data.player));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while getting player"));
    }
}

export const updatePlayerAPI = (updatedPlayer: Player): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/updatePlayer", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPlayer),
        })

        const data = await response.json();
        if(response.ok) {
            dispatch(updateSuccess(data.updatedPlayer));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while updating player"));
    }
}




export default playerSlice.reducer;