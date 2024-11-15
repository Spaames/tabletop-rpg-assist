import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";

interface AuthState {
    isAuthenticated: boolean;
    username: string;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    username: '',
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
        loginSuccess(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.username = action.payload;
            state.loading = false;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        login(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.username = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = "";
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, login, logout } = authSlice.actions;

export default authSlice.reducer;