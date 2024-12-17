import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/redux/features/authSlice";
import campaignReducer from "@/redux/features/campaignSlice"
import playerReducer from "@/redux/features/playerSlice"
import entityReducer from "@/redux/features/entitySlice"
import gameReducer from "@/redux/features/gameSlice"

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "campaign", "player", "entity", "game"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    campaign: campaignReducer,
    player: playerReducer,
    entity: entityReducer,
    game: gameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
