import { configureStore } from "@reduxjs/toolkit";
import responseReducer from "./slices/responseSlice"; // Adjust the import path as necessary

export function makeStore() {
    return configureStore({
        reducer: {
            responses: responseReducer,
        },
        devTools: process.env.NODE_ENV !== "production",
    });
}

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
