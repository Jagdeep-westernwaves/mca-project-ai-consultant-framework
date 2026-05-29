import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import consultingReducer from './consultingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    consulting: consultingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { User } from './authSlice';
