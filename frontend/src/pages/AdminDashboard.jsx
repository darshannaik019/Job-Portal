import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminApplications, updateAppStatus } from '../redux/slices/applicationSlice.js';
import { createJob, fetchJobs, deleteJob } from '../redux/slices/jobSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import BarChart from '../components/charts/BarChart.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import useToast from '../hooks/useToast.js';
import api from '../utils/api.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const addToast = useToast();
  
  const { applications, loading } = useSelector((state) => state.applications);
  const { jobs } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    activeJobs: 0,
    shortlistedCount: 0,
    hiredCount: 0,
    viewsBySource: [],
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    category: 'Engineering',
    jobType: 'Full Time',
    vacancy: '',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
  });

  const loadAnalytics = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(fetchAdminApplications());
    dispatch(fetchJobs({ createdBy: user?.id }));
    loadAnalytics();
  }, [dispatch, user]);

  const handleStatusChange = async (appId, newStatus) => {
    await dispatch(updateAppStatus({ applicationId: appId, status: newStatus }));
    addToast(`Candidate status updated to: ${newStatus.toUpperCase()}`, 'success');
    loadAnalytics();
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const requirementsArray = newJob.requirements.split(',').map((r) => r.trim()).filter(Boolean);
    const benefitsArray = newJob.benefits.split(',').map((b) => b.trim()).filter(Boolean);

    const jobData = {
      ...newJob,
      salaryMin: Number(newJob.salaryMin),
      salaryMax: Number(newJob.salaryMax),
      vacancy: Number(newJob.vacancy),
      requirements: requirementsArray,
      benefits: benefitsArray,
    };

    const action = await dispatch(createJob(jobData));
    if (createJob.fulfilled.match(action)) {
      addToast('Job listing published successfully!', 'success');
      setShowCreateModal(false);
      setNewJob({
        title: '',
        company: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        experience: '',
        category: 'Engineering',
        jobType: 'Full Time',
        vacancy: '',
        description: '',
        requirements: '',
        benefits: '',
        deadline: '',
      });
      dispatch(fetchJobs({ createdBy: user?.id }));
      loadAnalytics();
    } else {
      addToast(action.payload || 'Failed to publish job', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      await dispatch(deleteJob(jobId));
      addToast('Job listing removed', 'info');
      dispatch(fetchJobs({ createdBy: user?.id }));
      loadAnalytics();
    }
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex transition-colors">
      <Sidebar />

      {/* Main Canvas */}
      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          {/* Sticky Header */}
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">Recruiter Overview</span>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-primary rounded-lg font-semibold text-body-sm hover:scale-95 transition-transform active:scale-90"
            >
              Post a Job
            </button>
          </header>

          <div className="p-margin-desktop space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Total Applications</span>
                <p className="text-3xl font-black text-primary dark:text-white">{analytics.totalApplications}</p>
              </div>
              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Active Jobs</span>
                <p className="text-3xl font-black text-primary dark:text-white">{analytics.activeJobs}</p>
              </div>
              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Shortlisted Candidates</span>
                <p className="text-3xl font-black text-primary dark:text-white">{analytics.shortlistedCount}</p>
              </div>
              <div className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container flex flex-col justify-between h-32">
                <span className="text-on-surface-variant dark:text-on-tertiary-container font-medium text-body-sm">Hired Placements</span>
                <p className="text-3xl font-black text-primary dark:text-white">{analytics.hiredCount}</p>
              </div>
            </div>

            {/* Charts & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-8 rounded-2xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md">
                <h3 className="font-sans text-lg font-bold mb-6">Application Traffic</h3>
                <BarChart />
              </div>

              {/* Source Activity */}
              <div className="glass-card p-8 rounded-2xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md flex flex-col justify-between">
                <h3 className="font-sans text-lg font-bold mb-6">Views by Source</h3>
                <div className="space-y-4">
                  {[
                    { source: 'Direct Link', pct: '45%', color: 'bg-primary' },
                    { source: 'LinkedIn', pct: '32%', color: 'bg-secondary' },
                    { source: 'Job Boards', pct: '15%', color: 'bg-on-tertiary-fixed-variant' },
                    { source: 'Others', pct: '8%', color: 'bg-outline' },
                  ].map((src, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-body-sm">
                        <span className="font-medium">{src.source}</span>
                        <span className="text-on-surface-variant dark:text-on-tertiary-container">{src.pct}</span>
                      </div>
                      <div className="w-full bg-surface-container dark:bg-on-tertiary-fixed-variant/40 rounded-full h-2">
                        <div style={{ width: src.pct }} className={`${src.color} h-2 rounded-full`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Applications list */}
            <div className="glass-card rounded-2xl overflow-hidden bg-white dark:bg-primary-container border border-outline-variant/10 shadow">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 dark:bg-primary-container/50">
                <h3 className="font-sans text-lg font-bold">Latest Candidates</h3>
              </div>

              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton type="table" />
                </div>
              ) : applications.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant dark:text-on-tertiary-container">
                  No applications received yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Candidate</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Role</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Resume</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Status</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-body-sm">
                      {applications.map((app) => (
                        <tr key={app._id} className="hover:bg-surface-container-low dark:hover:bg-on-tertiary-fixed-variant/40 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold">{app.user?.name}</p>
                              <p className="text-[12px] text-on-surface-variant dark:text-on-tertiary-container">{app.user?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">{app.job?.title}</td>
                          <td className="px-6 py-4">
                            <a href={app.resume} target="_blank" rel="noreferrer" className="text-secondary font-semibold hover:underline flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">download</span> Resume
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

      {/* Post a Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white dark:bg-primary-container max-w-2xl w-full p-8 rounded-3xl border border-outline-variant/10 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sans text-xl font-bold">Publish New Job Opening</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface dark:text-on-tertiary-container dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Dev"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Inc"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zurich, CH"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Category *</label>
                <select
                  value={newJob.category}
                  onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Job Type *</label>
                <select
                  value={newJob.jobType}
                  onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Min Salary ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="80000"
                  value={newJob.salaryMin}
                  onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Max Salary ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="120000"
                  value={newJob.salaryMax}
                  onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Vacancy Count *</label>
                <input
                  type="number"
                  required
                  placeholder="3"
                  value={newJob.vacancy}
                  onChange={(e) => setNewJob({ ...newJob, vacancy: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Experience Requirement *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2-5 years"
                  value={newJob.experience}
                  onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Deadline Date *</label>
                <input
                  type="date"
                  required
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Requirements (comma separated)</label>
                <input
                  type="text"
                  placeholder="Node.js, MongoDB, React"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Benefits (comma separated)</label>
                <input
                  type="text"
                  placeholder="Health Insurance, Remote work, Flexible hours"
                  value={newJob.benefits}
                  onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail job requirements, roles, & company expectations..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="col-span-1 md:col-span-2 bg-primary text-on-primary dark:bg-white dark:text-primary py-4 rounded-xl font-bold text-body-sm hover:opacity-90 transition-opacity mt-4"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
