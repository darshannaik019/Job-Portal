import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SignUp } from '@clerk/clerk-react';
import useToast from '../hooks/useToast.js';

const RegisterPage = () => {
  const [role, setRole] = useState('user'); // Default: user (Job Seeker)
  const navigate = useNavigate();
  const addToast = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Sync role to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('pendingRole', role);
  }, [role]);

  useEffect(() => {
    if (isAuthenticated && user) {
      addToast('Account created successfully!', 'success');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate, addToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-primary-container p-6 transition-colors">
      <div className="glass-card max-w-lg w-full p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="font-sans text-2xl font-black text-primary dark:text-white tracking-tight">
            CareerPartner
          </Link>
          <h2 className="font-sans text-xl font-bold mt-4 dark:text-white">Create your account</h2>
          <p className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm mt-2">
            Choose your role and register to get started
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex gap-4 mb-6 bg-surface-container-low dark:bg-on-tertiary-fixed-variant p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex-1 py-3 rounded-xl font-bold text-body-sm transition-all duration-200 ${
              role === 'user'
                ? 'bg-white dark:bg-primary text-primary dark:text-white shadow'
                : 'text-on-surface-variant dark:text-on-tertiary-container hover:text-on-surface'
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-3 rounded-xl font-bold text-body-sm transition-all duration-200 ${
              role === 'admin'
                ? 'bg-white dark:bg-primary text-primary dark:text-white shadow'
                : 'text-on-surface-variant dark:text-on-tertiary-container hover:text-on-surface'
            }`}
          >
            Recruiter
          </button>
        </div>

        <div className="flex justify-center">
          <SignUp 
            routing="path" 
            path="/register" 
            signInUrl="/login"
            appearance={{
              elements: {
                card: "shadow-none border-0 p-0 m-0 w-full bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                footerAction: "dark:text-white",
                formButtonPrimary: "bg-primary dark:bg-white text-on-primary dark:text-primary hover:opacity-90 transition-opacity",
                formFieldInput: "bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
