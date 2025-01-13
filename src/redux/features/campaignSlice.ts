import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";

export interface Campaign {
    name: string;
    username: string;
    currentScene?: string;
}

interface CampaignState {
    campaigns: Campaign[];
    loading: boolean;
    error: null | string;
}

const initialState: CampaignState = {
    campaigns: [],
    loading: false,
    error: null,
};

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        createStart(state) {
            state.loading = true;
            state.error = null;
        },
        getStart(state) {
            state.loading = true;
            state.error = null;
        },
        updateStart(state) {
            state.loading = true;
            state.error = null;
        },
        createSuccess(state, action: PayloadAction<Campaign>) {
            state.campaigns.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        getSuccess(state, action: PayloadAction<Campaign[]>) {
            state.campaigns = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateSuccess(state, action: PayloadAction<Campaign>) {
            const updatedCampaign = action.payload;

            // Remplacer ou ajouter la campagne mise à jour
            const idx = state.campaigns.findIndex(
                (c) =>
                    c.username === updatedCampaign.username &&
                    c.name === updatedCampaign.name
            );
            if (idx === -1) {
                state.campaigns.push(updatedCampaign);
            } else {
                state.campaigns[idx] = updatedCampaign;
            }
            state.loading = false;
            state.error = null;
        },
        createFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        getFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    createStart, createSuccess, createFailure,
    getStart, getSuccess, getFailure,
    updateStart, updateSuccess, updateFailure,
} = campaignSlice.actions;

export const createCampaignAPI = (name: string, username: string): AppThunk => async (dispatch) => {
    try {
        dispatch(createStart());
        const response = await fetch("/api/createCampaign", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, username})
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(createSuccess(data.campaign));
        } else {
            dispatch(createFailure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(createFailure("Error while creating campaign"));
    }
}

export const getCampaignAPI = (username: string): AppThunk => async (dispatch) => {
    try {
        dispatch(getStart());
        const response = await fetch("/api/getCampaign", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(getSuccess(data.campaignList));
        } else {
            dispatch(getFailure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(getFailure("Error while getting campaign"));
    }
}

export const updateCampaignSceneAPI = (
    username: string,
    campaignName: string,
    background: string
): AppThunk => async (dispatch) => {
    try {
        dispatch(updateStart());
        const response = await fetch("/api/updateCampaign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                campaignName,
                currentScene: background,
            }),
        });
        const data = await response.json();

        if (!response.ok) {
            dispatch(updateFailure(data.message || "Error while updating campaign scene"));
            return;
        }

        // data.campaign => { name, username, currentScene, ... }
        dispatch(updateSuccess(data.campaign));
    } catch (err) {
        console.error("Error while updating campaign scene:", err);
        dispatch(updateFailure("Exception updating campaign scene"));
    }
};

export default campaignSlice.reducer;