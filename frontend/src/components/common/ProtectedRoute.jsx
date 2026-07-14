import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSkeleton from './LoadingSkeleton.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-primary-container p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
