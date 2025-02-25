import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AppThunk} from "@/redux/store";

export interface Entity {
    campaign: string;
    name: string;
    picture: string;
    HP: number;
    currentHealth: number;
    STR : number;
    DEX : number;
    INT : number;
    DEF: number;
    damage: string;
    particularity: string;
}

interface EntityState {
    entities: Entity[];
    loading: boolean;
    error: null | string;
}

const initialState: EntityState = {
    entities: [],
    loading: false,
    error: null,
}

const entitySlice = createSlice({
    name: 'entity',
    initialState,
    reducers: {
        start(state){
            state.loading = true;
            state.error = null;
        },
        createSuccess(state, action: PayloadAction<Entity>) {
            state.entities.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        getSuccess(state, action: PayloadAction<Entity[]>) {
            state.entities = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateSuccess(state, action: PayloadAction<Entity>) {
            const index = state.entities.findIndex(entity => entity.name === action.payload.name);
            if (index != -1) {
                state.entities[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        failure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateEntity(state, action: PayloadAction<{ campaign: string; updatedData: Partial<Entity> }>) {
            const { campaign, updatedData } = action.payload;
            const entityIndex = state.entities.findIndex(entity => entity.campaign === campaign);
            if (entityIndex !== -1) {
                state.entities[entityIndex] = {
                    ...state.entities[entityIndex],
                    ...updatedData,
                };
            }
        },
        updateEntities(state, action: PayloadAction<Entity[]>) {
            state.entities = action.payload;
        },
    }
});

export const {
    start, failure,
    createSuccess, getSuccess, updateSuccess,
    updateEntity, updateEntities,
} = entitySlice.actions;

/*
export const createEntityAPI = (campaignName: string): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/createEntity", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({campaignName}),
        });

        const data = await response.json();
        if(response.ok) {

        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while creating entity"));
    }
}
 */

export const getEntityAPI = (campaignName: string): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/getEntities", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({campaignName}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(getSuccess(data.entityList));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while getting entity"));
    }
}

export const updateEntitiesAPI = (updatedEntities: Entity[]): AppThunk => async (dispatch) => {
    try {
        dispatch(start());
        const response = await fetch("/api/updateEntities", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEntities),
        })

        const data = await response.json();
        if(response.ok) {
            dispatch(updateEntities(data.entityList));
        } else {
            dispatch(failure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failure("Error while updating entities"));
    }
}

export default entitySlice.reducer;