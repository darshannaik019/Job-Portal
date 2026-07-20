import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyApplications } from '../redux/slices/applicationSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import api from '../utils/api.js';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications, loading, error } = useSelector((state) => state.applications);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyApplications());
    
    const fetchRecommendations = async () => {
      setRecLoading(true);
      try {
        const { data } = await api.get('/jobs/recommendations');
        setRecommendations(data.jobs || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecommendations();
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

            {/* AI Recommendations */}
            <div className="glass-card rounded-2xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-2xl animate-pulse">insights</span>
                  <h3 className="font-sans text-lg font-bold">Tailored AI Recommendations</h3>
                </div>
                <span className="text-[10px] md:text-xs text-on-surface-variant dark:text-on-tertiary-container bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">
                  Powered by Gemini AI matching
                </span>
              </div>

              {recLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <LoadingSkeleton type="card" />
                  <LoadingSkeleton type="card" />
                  <LoadingSkeleton type="card" />
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">recommend</span>
                  <p className="text-on-surface-variant dark:text-on-tertiary-container mt-2 text-body-sm">
                    Upload your resume in Profile to receive personalized AI recommendations.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((job) => (
                    <div key={job._id} className="relative p-5 rounded-xl border border-outline-variant/15 hover:border-secondary/30 hover:shadow-md transition-all flex flex-col justify-between bg-surface-container-lowest dark:bg-primary-container/20 group">
                      {/* Match Badge */}
                      <span className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full ${
                        job.matchScore >= 80 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : job.matchScore >= 60 
                            ? 'bg-amber-500/10 text-amber-600' 
                            : 'bg-slate-400/10 text-slate-600'
                      }`}>
                        {job.matchScore}% Match
                      </span>
                      
                      <div className="space-y-3">
                        <div className="pr-16">
                          <h4 className="font-bold text-body-sm line-clamp-1 group-hover:text-secondary transition-colors">{job.title}</h4>
                          <p className="text-xs text-on-surface-variant dark:text-on-tertiary-container">{job.company}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant dark:bg-on-tertiary-fixed-variant/40 dark:text-white font-semibold">
                            {job.location}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant dark:bg-on-tertiary-fixed-variant/40 dark:text-white font-semibold">
                            {job.jobType}
                          </span>
                        </div>

                        {job.matchedSkills && job.matchedSkills.length > 0 && (
                          <div className="pt-2">
                            <p className="text-[10px] text-on-surface-variant dark:text-on-tertiary-container font-semibold uppercase tracking-wider mb-1">Matched Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {job.matchedSkills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface">
                          ${(job.salaryMin/1000).toFixed(0)}k - ${(job.salaryMax/1000).toFixed(0)}k
                        </span>
                        <Link to={`/jobs/${job._id}`} className="text-xs text-secondary font-black hover:underline flex items-center gap-1">
                          Apply Now
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
