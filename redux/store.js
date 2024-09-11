import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer, persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import usersSlice from "./user/usersSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['userDetails']
};

const persistedUserReducer = persistReducer(persistConfig, usersSlice);

export const store = configureStore({
  reducer: {
    usersSlice: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
