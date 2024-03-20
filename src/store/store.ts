import { combineReducers, configureStore } from '@reduxjs/toolkit';
import getPlayerIdSlice from './reducres/getPlayerIdSlice';
import getTokenSlice from './reducres/getTokenSlice';
import  popUpSlice  from './reducres/popUpSlice';
const rootReducer = combineReducers({
    playerId: getPlayerIdSlice,
    token: getTokenSlice,
    popup: popUpSlice
});

export const setupStore = () => {
    return configureStore({
        reducer:    rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        }),

    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
