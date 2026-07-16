import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminApplications, updateAppStatus } from '../redux/slices/applicationSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import useToast from '../hooks/useToast.js';

const ManageApplicationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToast = useToast();
  const { applications, loading, error } = useSelector((state) => state.applications);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    dispatch(fetchAdminApplications(sortOrder));
  }, [dispatch, sortOrder]);

  const handleStatusChange = async (appId, newStatus) => {
    await dispatch(updateAppStatus({ applicationId: appId, status: newStatus }));
    addToast(`Candidate status updated to: ${newStatus.toUpperCase()}`, 'success');
  };

  const filteredApps = applications.filter((app) => 
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex transition-colors">
      <Sidebar />

      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">Applications Portal</span>
            
            <div className="flex gap-4 items-center">
              <span className="text-xs text-on-surface-variant dark:text-on-tertiary-container font-medium">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-surface-container border-none text-body-sm rounded-lg focus:ring-secondary py-1 px-3 text-on-surface dark:text-white dark:bg-on-tertiary-fixed-variant"
              >
                <option value="newest">Newest First</option>
                <option value="aiScore">AI Match Score</option>
              </select>

              <span className="text-xs text-on-surface-variant dark:text-on-tertiary-container font-medium ml-2">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-surface-container border-none text-body-sm rounded-lg focus:ring-secondary py-1 px-3 text-on-surface dark:text-white dark:bg-on-tertiary-fixed-variant"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </header>

          <div className="p-margin-desktop">
            <div className="glass-card rounded-2xl overflow-hidden bg-white dark:bg-primary-container border border-outline-variant/10 shadow">
              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton type="table" />
                </div>
              ) : error ? (
                <div className="p-12 text-center text-error">{error}</div>
              ) : filteredApps.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">find_in_page</span>
                  <p className="text-on-surface-variant dark:text-on-tertiary-container mt-2">No applications match this filter status.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Candidate</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Job Role</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">AI Match Rating</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Resume</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Status</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-body-sm">
                      {filteredApps.map((app) => (
                        <tr key={app._id} className="hover:bg-surface-container-low dark:hover:bg-on-tertiary-fixed-variant/40 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold">{app.user?.name}</p>
                              <p className="text-[12px] text-on-surface-variant dark:text-on-tertiary-container">{app.user?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">{app.job?.title}</td>
                          <td className="px-6 py-4">
                            {app.aiScore !== undefined ? (
                              <div className="flex flex-col gap-1">
                                <span className={`inline-block w-24 px-2 py-0.5 text-xs font-bold rounded-lg border text-center ${
                                  app.aiScore >= 80 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25' :
                                  app.aiScore >= 50 ? 'text-amber-500 bg-amber-500/10 border-amber-500/25' :
                                  'text-rose-500 bg-rose-500/10 border-rose-500/25'
                                }`}>
                                  {app.aiScore}% Match
                                </span>
                                <span className="text-[10px] text-on-surface-variant dark:text-on-tertiary-container max-w-[200px] line-clamp-2" title={app.aiFeedback}>
                                  {app.aiFeedback || 'Candidate analysis completed.'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-on-surface-variant dark:text-on-tertiary-container">Not Scored</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <a href={app.resume} target="_blank" rel="noreferrer" className="text-secondary font-semibold hover:underline">
                              View File
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase ${
                              app.status === 'shortlisted' ? 'bg-secondary-container/30 text-secondary' :
                              app.status === 'rejected' ? 'bg-error-container/20 text-error' :
                              app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-600' :
                              'bg-surface-container text-on-surface-variant'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                className="bg-surface-container border-none text-body-sm rounded-lg focus:ring-secondary py-1 text-on-surface dark:text-white dark:bg-on-tertiary-fixed-variant"
                              >
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlist</option>
                                <option value="hired">Hire</option>
                                <option value="rejected">Reject</option>
                              </select>
                              <button
                                onClick={() => navigate('/chat', { state: { user: app.user } })}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-container-high hover:bg-secondary hover:text-white transition-all text-on-surface dark:text-white dark:bg-on-tertiary-fixed-variant dark:hover:bg-secondary"
                                title="Chat with Candidate"
                              >
                                <span className="material-symbols-outlined text-sm">chat</span>
                                Chat
                              </button>
                            </div>
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

export default ManageApplicationsPage;
