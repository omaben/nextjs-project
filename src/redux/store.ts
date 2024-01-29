import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import userReducer from './slices/user';
import socketReducer from "./socketSlice";
import loadingReducer from "./loadingSlice";
import crashConfigReducer from './slices/crashConfig'

const persistConfig = { key: "root", version: 1, storage, blacklist: ["socket", "socketSupport"] };
const rootReducer = combineReducers({
   auth: authReducer,
   loading: loadingReducer,
   socket: socketReducer,
   user: userReducer,
   crashConfig: crashConfigReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
