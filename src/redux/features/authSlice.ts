import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/redux/store";
import axiosInstance from "@/utils/axiosConfig";

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
        loginSuccess(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.user.username = action.payload;
            state.loading = false;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        login(state, action: PayloadAction<string>) {
            state.isAuthenticated = true;
            state.user.username = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user.username = "";
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, login, logout } = authSlice.actions;

export const loginAPI = (username: string, password: string): AppThunk => async (dispatch) => {
    try {
        dispatch(loginStart());
        const response = await axiosInstance.post("/api/login", {
            username,
            password,
        });

        const data = response.data;
        if (data.status === "success") {
            dispatch(loginSuccess(data.username));
        } else {
            dispatch(loginFailure(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(loginFailure("Error while logging in"));
    }
}

export default authSlice.reducer;