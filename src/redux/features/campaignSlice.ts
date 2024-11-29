import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";

interface Campaign {
    name: string;
    username: string;
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
        createFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        getFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    createStart, createSuccess, createFailure,
    getStart, getSuccess, getFailure,
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

export default campaignSlice.reducer;