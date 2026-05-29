import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'consultant' | 'client';
  first_name: string;
  last_name: string;
  date_joined?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('aimcf_access_token'),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: Record<string, string>, thunkAPI) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('aimcf_access_token', access);
      localStorage.setItem('aimcf_refresh_token', refresh);
      
      return { user, access };
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Invalid username or password.';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (fields: Record<string, string>, thunkAPI) => {
    try {
      const response = await api.post('/auth/register/', fields);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Registration failed. Try again.';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const loadUserProfile = createAsyncThunk(
  'auth/loadProfile',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Session expired.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem('aimcf_access_token');
      localStorage.removeItem('aimcf_refresh_token');
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; access: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load Profile
      .addCase(loadUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(loadUserProfile.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem('aimcf_access_token');
        localStorage.removeItem('aimcf_refresh_token');
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
export type { User };
