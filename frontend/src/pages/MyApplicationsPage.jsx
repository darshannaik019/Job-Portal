import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../redux/slices/applicationSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';

const MyApplicationsPage = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const statusColors = {
    pending: 'bg-surface-container text-on-surface-variant',
    shortlisted: 'bg-secondary-container/30 text-secondary font-semibold',
    rejected: 'bg-error-container/20 text-error font-semibold',
    hired: 'bg-emerald-500/10 text-emerald-600 font-semibold',
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex transition-colors">
      <Sidebar />

      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">My Applications</span>
          </header>

          <div className="p-margin-desktop">
            <div className="glass-card rounded-2xl overflow-hidden bg-white dark:bg-primary-container border border-outline-variant/10 shadow">
              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton type="table" />
                </div>
              ) : error ? (
                <div className="p-12 text-center text-error">{error}</div>
              ) : applications.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">work_history</span>
                  <p className="text-on-surface-variant dark:text-on-tertiary-container mt-2">You haven't applied to any jobs yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Company</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Role</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Applied Date</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-body-sm">
                      {applications.map((app) => (
                        <tr key={app._id} className="hover:bg-surface-container-low dark:hover:bg-on-tertiary-fixed-variant/40 transition-colors">
                          <td className="px-6 py-4 font-bold">{app.job?.company}</td>
                          <td className="px-6 py-4">{app.job?.title}</td>
                          <td className="px-6 py-4 text-on-surface-variant dark:text-on-tertiary-container">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[11px] rounded-full uppercase font-bold ${statusColors[app.status]}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyApplicationsPage;
