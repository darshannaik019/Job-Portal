import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, clearErrors } from '../redux/slices/authSlice.js';
import useToast from '../hooks/useToast.js';

const RegisterPage = () => {
  const [role, setRole] = useState('user'); // Default: user (Job Seeker)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addToast = useToast();
  const { isAuthenticated, user, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      addToast('Account created successfully!', 'success');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
    if (error) {
      addToast(error, 'error');
      dispatch(clearErrors());
    }
  }, [isAuthenticated, user, error, navigate, addToast, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    dispatch(register({ name, email, password, role, phone }));
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-body-sm font-semibold mb-1 text-on-surface-variant dark:text-on-tertiary-container">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border border-outline-variant/20 dark:border-transparent rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-body-sm font-semibold mb-1 text-on-surface-variant dark:text-on-tertiary-container">
              Email Address *
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
            <label className="block text-body-sm font-semibold mb-1 text-on-surface-variant dark:text-on-tertiary-container">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border border-outline-variant/20 dark:border-transparent rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all"
            />
          </div>

          <div>
            <label className="block text-body-sm font-semibold mb-1 text-on-surface-variant dark:text-on-tertiary-container">
              Password *
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
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
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary dark:text-white hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
