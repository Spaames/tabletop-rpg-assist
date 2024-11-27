import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";

interface User {
    username: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: {username: ""},
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        registerStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.user.username = action.payload;
            state.loading = false;
        },
        registerSuccess(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.user.username = action.payload;
            state.loading = false;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        registerFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.loading = false;
            state.error = null;
            state.user.username = "";
            state.isAuthenticated = false;
        }
    },
});

export const {
    loginStart, loginSuccess, loginFailure,
    logout,
    registerStart, registerSuccess, registerFailure,
} = authSlice.actions;

export const loginAPI = (username: string, password: string): AppThunk => async (dispatch) => {
    try {
        dispatch(loginStart());
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(loginSuccess(data.username));
        } else {
            dispatch(loginFailure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(loginFailure("Error while logging in"));
    }
}

export const registerAPI = (username: string, password: string): AppThunk => async (dispatch) => {
    try {
        dispatch(registerStart());
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password}),
        });

        const data = await response.json();
        if(response.ok) {
            dispatch(registerSuccess(data.username));
        } else {
            dispatch(loginFailure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(registerFailure("Error while registering user"));
    }
}


export default authSlice.reducer;