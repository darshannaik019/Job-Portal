import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const pendingRole = sessionStorage.getItem('pendingRole');
      const headers = pendingRole ? { 'X-Pending-Role': pendingRole } : {};
      const { data } = await api.get('/users/profile', { headers });
      
      // Successfully synced and loaded, we can clear the pendingRole
      if (pendingRole) {
        sessionStorage.removeItem('pendingRole');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  loading: true, // Start with loading true until Clerk determines sign-in status
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    localLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, localLogout } = authSlice.actions;
export default authSlice.reducer;
