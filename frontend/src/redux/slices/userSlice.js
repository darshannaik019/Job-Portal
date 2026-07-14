import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/profile', profileData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadUserResume = createAsyncThunk(
  'user/uploadResume',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
    }
  }
);

export const uploadUserPhoto = createAsyncThunk(
  'user/uploadPhoto',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await api.post('/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload photo');
    }
  }
);

export const toggleSaveJob = createAsyncThunk(
  'user/toggleSaveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/save-job/${jobId}`);
      return data.savedJobs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save job');
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Upload Resume
      .addCase(uploadUserResume.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(uploadUserResume.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadUserResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Photo
      .addCase(uploadUserPhoto.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(uploadUserPhoto.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadUserPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
