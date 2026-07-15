import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SignIn } from '@clerk/clerk-react';
import useToast from '../hooks/useToast.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const addToast = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      addToast('Logged in successfully!', 'success');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate, addToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-primary-container p-6 transition-colors">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="font-sans text-2xl font-black text-primary dark:text-white tracking-tight">
            CareerPartner
          </Link>
          <h2 className="font-sans text-xl font-bold mt-4 dark:text-white">Welcome back</h2>
          <p className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/register"
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

export default LoginPage;
