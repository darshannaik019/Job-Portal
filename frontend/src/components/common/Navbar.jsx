import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';
import { useTheme } from '../../context/ThemeContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="font-sans text-2xl font-black text-primary dark:text-white tracking-tight">
            CareerPartner
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/jobs" className="text-on-surface-variant hover:text-secondary dark:text-on-tertiary-container dark:hover:text-white transition-colors duration-200 font-medium text-body-sm">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-on-surface-variant hover:text-secondary dark:text-on-tertiary-container dark:hover:text-white transition-colors duration-200 font-medium text-body-sm">
              Companies
            </Link>
            <Link to="/salaries" className="text-on-surface-variant hover:text-secondary dark:text-on-tertiary-container dark:hover:text-white transition-colors duration-200 font-medium text-body-sm">
              Salaries
            </Link>
            <Link to="/resources" className="text-on-surface-variant hover:text-secondary dark:text-on-tertiary-container dark:hover:text-white transition-colors duration-200 font-medium text-body-sm">
              Resources
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Light/Dark mode toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 text-on-surface-variant hover:text-primary dark:text-on-tertiary-container dark:hover:text-white rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                className="text-on-surface-variant hover:text-secondary dark:text-on-tertiary-container dark:hover:text-white transition-colors text-body-sm font-semibold"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="hidden lg:block text-error text-body-sm font-semibold hover:opacity-85"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-on-surface-variant hover:text-secondary dark:text-on-tertiary-container dark:hover:text-white transition-colors text-body-sm font-semibold"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-on-primary dark:bg-white dark:text-primary px-6 py-2.5 rounded-lg font-semibold scale-95 active:scale-90 transition-all hover:opacity-90 text-body-sm"
              >
                Post a Job
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-on-surface-variant dark:text-on-tertiary-container rounded-lg"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/10 bg-surface dark:bg-primary-container px-6 py-4 flex flex-col gap-4 animate-slide-in">
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-on-surface dark:text-white font-medium text-body-sm">
            Find Jobs
          </Link>
          <Link to="/companies" onClick={() => setMobileMenuOpen(false)} className="text-on-surface dark:text-white font-medium text-body-sm">
            Companies
          </Link>
          <Link to="/salaries" onClick={() => setMobileMenuOpen(false)} className="text-on-surface dark:text-white font-medium text-body-sm">
            Salaries
          </Link>
          <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="text-on-surface dark:text-white font-medium text-body-sm">
            Resources
          </Link>
          {isAuthenticated && (
            <button 
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="text-error font-medium text-body-sm text-left"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
