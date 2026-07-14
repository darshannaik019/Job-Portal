import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyApplications } from '../redux/slices/applicationSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications, loading, error } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  // Derive stats
  const totalApplied = applications?.length || 0;
  const savedCount = user?.savedJobs?.length || 0;
  
  // Custom Status Color Map
  const statusColors = {
    pending: 'bg-surface-container text-on-surface-variant',
    shortlisted: 'bg-secondary-container/30 text-secondary font-semibold',
    rejected: 'bg-error-container/20 text-error font-semibold',
    hired: 'bg-emerald-500/10 text-emerald-600 font-semibold',
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex">
      <Sidebar />

      {/* Main Canvas */}
      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          {/* Sticky header */}
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">Dashboard Overview</span>
            <div className="flex items-center gap-4">
              <span className="text-body-sm font-medium">Hello, {user?.name}</span>
            </div>
          </header>

          <section className="px-margin-desktop py-8 space-y-8">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-10 flex flex-col justify-center min-h-[200px] border border-outline-variant/10">
              <h1 className="font-sans text-3xl font-extrabold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-on-primary-container max-w-lg mb-6 text-body-sm">
                Your profile is getting noticed. Ready to land your next big role? Discover opportunities tailored for you.
              </p>
              <div className="flex gap-4">
                <Link to="/jobs" className="bg-secondary text-on-primary px-6 py-2.5 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all text-body-sm">
                  Browse Jobs
                </Link>
                <Link to="/profile" className="bg-white/10 backdrop-blur-md text-on-primary px-6 py-2.5 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all text-body-sm">
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Stats block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Applied Jobs</span>
                  <span className="material-symbols-outlined text-secondary">work</span>
                </div>
                <h4 className="text-4xl font-black mt-2">{totalApplied}</h4>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Saved Jobs</span>
                  <span className="material-symbols-outlined text-secondary">bookmark</span>
                </div>
                <h4 className="text-4xl font-black mt-2">{savedCount}</h4>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Interviews</span>
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                </div>
                <h4 className="text-4xl font-black mt-2">0</h4>
              </div>
            </div>

            {/* Recent applications table */}
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl overflow-hidden bg-white dark:bg-primary-container border border-outline-variant/10 shadow">
                <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                  <h3 className="font-sans text-lg font-bold">Recent Applications</h3>
                  <Link to="/applications/my" className="text-secondary font-semibold text-body-sm hover:underline">
                    View All
                  </Link>
                </div>

                {loading ? (
                  <div className="p-6">
                    <LoadingSkeleton type="table" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">work_history</span>
                    <p className="text-on-surface-variant dark:text-on-tertiary-container mt-2 text-body-sm">No applications submitted yet.</p>
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
                        {applications.slice(0, 4).map((app) => (
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

              {/* Saved Jobs Quicklist */}
              <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-2xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-sans text-lg font-bold mb-6">Saved Jobs</h3>
                  {user?.savedJobs && user.savedJobs.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
                        You have {user.savedJobs.length} saved job openings.
                      </p>
                      <Link to="/jobs" className="text-secondary dark:text-secondary-fixed-dim text-body-sm font-semibold hover:underline block">
                        Browse listings to review saved jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <span className="material-symbols-outlined text-3xl text-outline-variant">bookmark</span>
                      <p className="text-on-surface-variant dark:text-on-tertiary-container mt-2 text-body-sm">No saved jobs yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
