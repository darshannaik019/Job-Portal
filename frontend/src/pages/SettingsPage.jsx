import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import useToast from '../hooks/useToast.js';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const addToast = useToast();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return addToast('Please fill in all fields', 'warning');
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return addToast('Passwords do not match', 'error');
    }
    // Simulation
    addToast('Password updated successfully (Simulated)', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex transition-colors">
      <Sidebar />

      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">Preferences & Security</span>
          </header>

          <div className="p-margin-desktop space-y-8 max-w-2xl">
            {/* Preferences */}
            <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md space-y-6">
              <h3 className="font-sans text-lg font-bold border-b border-outline-variant/10 pb-4">Theme Settings</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-body-sm">Dark Mode</p>
                  <p className="text-[12px] text-on-surface-variant dark:text-on-tertiary-container">Reduce glare and browse comfortably in dark environments</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    theme === 'dark' ? 'bg-secondary' : 'bg-outline-variant'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform duration-200 ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Security */}
            <form onSubmit={handlePasswordSubmit} className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md space-y-6">
              <h3 className="font-sans text-lg font-bold border-b border-outline-variant/10 pb-4">Update Password</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary dark:bg-white dark:text-primary py-3 rounded-xl font-bold text-body-sm hover:opacity-90 transition-opacity"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
