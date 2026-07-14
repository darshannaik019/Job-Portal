import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async ({ jobId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/applications/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply for job');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/applications/my');
      return data.applications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load applications');
    }
  }
);

export const fetchAdminApplications = createAsyncThunk(
  'applications/fetchAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/applications');
      return data.applications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load candidate applications');
    }
  }
);

export const updateAppStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/applications/${applicationId}/status`, { status });
      return data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
  }
);

const initialState = {
  applications: [],
  loading: false,
  error: null,
  success: false,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearAppState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.applications.unshift(action.payload);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch My Applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Admin Applications
      .addCase(fetchAdminApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchAdminApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateAppStatus.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) => 
          app._id === action.payload._id ? { ...app, status: action.payload.status } : app
        );
        state.success = true;
      });
  },
});

export const { clearAppState } = applicationSlice.actions;
export default applicationSlice.reducer;
