import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, localLogout } from './redux/slices/authSlice.js';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import BrowseJobs from './pages/BrowseJobs.jsx';
import JobDetailsPage from './pages/JobDetailsPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ApplicationFormPage from './pages/ApplicationFormPage.jsx';
import ManageApplicationsPage from './pages/ManageApplicationsPage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import AdminJobsPage from './pages/AdminJobsPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CompaniesPage from './pages/CompaniesPage.jsx';
import SalariesPage from './pages/SalariesPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    } else {
      dispatch(localLogout());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/salaries" element={<SalariesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />

        {/* Seeker Private Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <ApplicationFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/my"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Private Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminJobsPage />
            </ProtectedRoute>
          }
        />

        {/* Shared Private Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
