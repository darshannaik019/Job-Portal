import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../redux/slices/authSlice.js';
import useToast from '../hooks/useToast.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToast = useToast();

  const { isAuthenticated, error, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      addToast('Logged in successfully!', 'success');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }

    if (error) {
      addToast(error, 'error');
      dispatch(clearErrors());
    }
  }, [isAuthenticated, error, user, navigate, dispatch, addToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return addToast('Please enter all fields', 'warning');
    }
    dispatch(loginUser({ email, password }));
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-secondary/25"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-secondary/25"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary dark:bg-white dark:text-primary py-4 rounded-xl font-bold text-body-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
          New to CareerPartner?{' '}
          <Link to="/register" className="text-secondary dark:text-secondary-fixed-dim font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
