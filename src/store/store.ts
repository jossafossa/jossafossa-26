import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { cvApi } from '@/data/cvApi';

export const store = configureStore({
  reducer: { [cvApi.reducerPath]: cvApi.reducer },
  middleware: (getDefault) => getDefault().concat(cvApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
