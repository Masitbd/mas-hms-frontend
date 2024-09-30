import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { reducer } from "./rootReducer";
import { setupListeners } from "@reduxjs/toolkit/query";
// ...

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
