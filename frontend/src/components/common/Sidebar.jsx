import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice.js';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const seekerLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'My Applications', path: '/applications/my', icon: 'work_history' },
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const adminLinks = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Manage Applications', path: '/admin/applications', icon: 'task' },
    { label: 'Manage Jobs', path: '/admin/jobs', icon: 'work' },
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const currentLinks = user?.role === 'admin' ? adminLinks : seekerLinks;

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-bright dark:bg-primary-container border-r border-outline-variant/10 shadow-lg flex flex-col py-8 px-4 gap-2 z-50 transition-all duration-200">
      <div className="mb-10 px-4">
        <Link to="/" className="font-sans text-xl font-bold text-primary dark:text-white">
          CareerPartner
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {currentLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all hover:translate-x-1 duration-200 ${
              isActive(link.path)
                ? 'bg-secondary-container/20 dark:bg-secondary-fixed/10 text-secondary dark:text-secondary-fixed-dim border-l-4 border-secondary'
                : 'text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-high dark:hover:bg-on-tertiary-fixed-variant'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(link.path) ? "'FILL' 1" : "'FILL' 0" }}>
              {link.icon}
            </span>
            <span className="font-sans text-body-sm">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 py-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 mb-6">
          <img
            className="w-10 h-10 rounded-full object-cover border border-outline-variant/10"
            src={
              user?.profilePhoto ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
            }
            alt={user?.name}
          />
          <div className="overflow-hidden">
            <p className="font-sans text-body-sm font-bold text-primary dark:text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-on-surface-variant dark:text-on-tertiary-container truncate">
              {user?.role === 'admin' ? 'Recruiter Account' : 'Job Seeker'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-secondary text-on-primary py-2.5 rounded-lg font-sans text-body-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
