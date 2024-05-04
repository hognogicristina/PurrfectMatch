import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialAuthState = { isAuthenticated: false };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export const persistor = persistStore(store);

export async function validateToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await fetch("http://localhost:3000/refresh", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    return response.ok;
  }
  return false;
}

validateToken().then((isValid) => {
  if (isValid) {
    store.dispatch(authActions.login());
  } else {
    localStorage.removeItem("token");
    store.dispatch(authActions.logout());
  }
});

export const authActions = authSlice.actions;

export default store;
