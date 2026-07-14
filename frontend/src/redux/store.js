import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import jobReducer from './slices/jobSlice.js';
import applicationReducer from './slices/applicationSlice.js';
import userReducer from './slices/userSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    user: userReducer,
  },
});
export default store;
