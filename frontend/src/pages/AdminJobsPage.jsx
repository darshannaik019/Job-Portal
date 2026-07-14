import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJobs, deleteJob } from '../redux/slices/jobSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import useToast from '../hooks/useToast.js';

const AdminJobsPage = () => {
  const dispatch = useDispatch();
  const addToast = useToast();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobs({ createdBy: user?.id }));
  }, [dispatch, user]);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      await dispatch(deleteJob(jobId));
      addToast('Job listing removed', 'info');
      dispatch(fetchJobs({ createdBy: user?.id }));
    }
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex transition-colors">
      <Sidebar />

      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">Manage Job Openings</span>
            <Link to="/admin/dashboard" className="px-4 py-2 bg-primary text-on-primary dark:bg-white dark:text-primary rounded-lg text-body-sm font-semibold">
              Create Job
            </Link>
          </header>

          <div className="p-margin-desktop">
            <div className="glass-card rounded-2xl overflow-hidden bg-white dark:bg-primary-container border border-outline-variant/10 shadow">
              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton type="table" />
                </div>
              ) : error ? (
                <div className="p-12 text-center text-error">{error}</div>
              ) : jobs.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">work</span>
                  <p className="text-on-surface-variant dark:text-on-tertiary-container mt-2">You haven't posted any jobs yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Job Title</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Location</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Category</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Deadline</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-body-sm">
                      {jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-surface-container-low dark:hover:bg-on-tertiary-fixed-variant/40 transition-colors">
                          <td className="px-6 py-4 font-bold">{job.title}</td>
                          <td className="px-6 py-4">{job.location}</td>
                          <td className="px-6 py-4">{job.category}</td>
                          <td className="px-6 py-4 text-on-surface-variant dark:text-on-tertiary-container">
                            {new Date(job.deadline).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex gap-3">
                            <Link to={`/jobs/${job._id}`} className="text-secondary font-semibold hover:underline">
                              View
                            </Link>
                            <button onClick={() => handleDelete(job._id)} className="text-error font-semibold hover:underline">
                              Delete
                            </button>
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

export default AdminJobsPage;
