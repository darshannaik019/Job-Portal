import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs', { params: queryParams });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchDetails',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${jobId}`);
      return data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/jobs', jobData);
      return data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/jobs/${jobId}`, jobData);
      return data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

const initialState = {
  jobs: [],
  job: null,
  pagination: {},
  loading: false,
  error: null,
  success: false,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.job = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.job = action.payload;
        state.jobs = state.jobs.map((job) => job._id === action.payload._id ? action.payload : job);
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        state.success = true;
      });
  },
});

export const { clearJobState } = jobSlice.actions;
export default jobSlice.reducer;
