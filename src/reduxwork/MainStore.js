import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage";
import UserSlice from "./UserSlice"


const timeoutMiddleware = store => next => action => {
    const result = next(action);
    if (action.type === '/') {
        setTimeout(() => {
            store.dispatch(logout());
        }, 5000);
    }
    return result;
}

const persistConfig = {
    key: "user",
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    user : UserSlice
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  export const MainStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(timeoutMiddleware)
})
export default MainStore;