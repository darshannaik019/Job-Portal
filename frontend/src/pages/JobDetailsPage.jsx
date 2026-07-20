import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobDetails } from '../redux/slices/jobSlice.js';
import { toggleSaveJob } from '../redux/slices/userSlice.js';
import { loadUser } from '../redux/slices/authSlice.js';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import useToast from '../hooks/useToast.js';

const JobDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const addToast = useToast();
  
  const { job, loading, error } = useSelector((state) => state.jobs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobDetails(id));
  }, [dispatch, id]);

  const isSaved = user?.savedJobs?.includes(job?._id);

  const handleSave = async () => {
    if (!isAuthenticated) {
      return addToast('Please sign in to save jobs', 'warning');
    }
    await dispatch(toggleSaveJob(job._id));
    dispatch(loadUser());
    addToast(isSaved ? 'Job removed from saved list' : 'Job saved successfully!', 'success');
  };

  if (loading) {
    return (
      <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen">
        <Navbar />
        <div className="pt-28 max-w-container-max mx-auto px-margin-desktop">
          <LoadingSkeleton type="detail" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-error">warning</span>
          <p className="mt-4 text-on-surface-variant">{error || 'Job details not found'}</p>
          <Link to="/jobs" className="mt-6 inline-block bg-primary text-on-primary px-6 py-2.5 rounded-lg">
            Back to listings
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-28 flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-16">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline text-4xl">corporate_fare</span>
                  </div>
                  <div>
                    <h1 className="font-sans text-2xl font-black">{job.title}</h1>
                    <p className="text-on-surface-variant dark:text-on-tertiary-container font-medium">{job.company} • {job.location}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave} 
                    className="p-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    <span className={`material-symbols-outlined ${isSaved ? 'text-secondary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                      bookmark
                    </span>
                  </button>
                  {user?.role !== 'admin' && (
                    <Link 
                      to={`/jobs/${job._id}/apply`}
                      className="bg-primary text-on-primary dark:bg-white dark:text-primary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-outline-variant/10">
                <div className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant px-4 py-2 rounded-xl text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
                  <strong>Salary:</strong> ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / year
                </div>
                <div className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant px-4 py-2 rounded-xl text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
                  <strong>Job Type:</strong> {job.jobType}
                </div>
                <div className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant px-4 py-2 rounded-xl text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
                  <strong>Experience:</strong> {job.experience}
                </div>
                <div className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant px-4 py-2 rounded-xl text-body-sm text-on-surface-variant dark:text-on-tertiary-container">
                  <strong>Vacancy:</strong> {job.vacancy} positions
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md space-y-6">
              <div>
                <h3 className="font-sans text-xl font-bold mb-4">Job Description</h3>
                <p className="text-on-surface-variant dark:text-on-tertiary-container leading-relaxed whitespace-pre-line text-body-sm">
                  {job.description}
                </p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="font-sans text-xl font-bold mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-on-surface-variant dark:text-on-tertiary-container text-body-sm">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h3 className="font-sans text-xl font-bold mb-4">Benefits & Perks</h3>
                  <ul className="list-disc pl-5 space-y-2 text-on-surface-variant dark:text-on-tertiary-container text-body-sm">
                    {job.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md">
              <h4 className="font-sans text-lg font-bold mb-4">Recruiter Profile</h4>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-2xl">person</span>
                </div>
                <div>
                  <p className="font-bold text-body-sm">{job.createdBy?.name || 'Recruiter'}</p>
                  <p className="text-[12px] text-on-surface-variant dark:text-on-tertiary-container">Employer</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-outline-variant/10 text-body-sm">
                <div className="flex items-center gap-2 text-on-surface-variant dark:text-on-tertiary-container">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>{job.createdBy?.email}</span>
                </div>
                {job.createdBy?.phone && (
                  <div className="flex items-center gap-2 text-on-surface-variant dark:text-on-tertiary-container">
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>{job.createdBy?.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-on-surface-variant dark:text-on-tertiary-container">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;
