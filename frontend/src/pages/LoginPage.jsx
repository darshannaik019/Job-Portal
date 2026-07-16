import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearErrors } from '../redux/slices/authSlice.js';
import useToast from '../hooks/useToast.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addToast = useToast();
  const { isAuthenticated, user, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      addToast('Logged in successfully!', 'success');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
    if (error) {
      addToast(error, 'error');
      dispatch(clearErrors());
    }
  }, [isAuthenticated, user, error, navigate, addToast, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    dispatch(login({ email, password }));
  };

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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-body-sm font-semibold mb-2 text-on-surface-variant dark:text-on-tertiary-container">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border border-outline-variant/20 dark:border-transparent rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-body-sm font-semibold text-on-surface-variant dark:text-on-tertiary-container">
                Password
              </label>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border border-outline-variant/20 dark:border-transparent rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary dark:bg-white text-on-primary dark:text-primary hover:opacity-90 transition-opacity font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm shadow-lg disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary dark:text-white hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
