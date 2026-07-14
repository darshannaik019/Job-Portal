import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobDetails } from '../redux/slices/jobSlice.js';
import { applyToJob, clearAppState } from '../redux/slices/applicationSlice.js';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import useToast from '../hooks/useToast.js';

const ApplicationFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToast = useToast();

  const { job } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { success, error, loading } = useSelector((state) => state.applications);

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);

  useEffect(() => {
    dispatch(fetchJobDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      addToast('Application submitted successfully!', 'success');
      dispatch(clearAppState());
      navigate('/dashboard');
    }
    if (error) {
      addToast(error, 'error');
      dispatch(clearAppState());
    }
  }, [success, error, navigate, dispatch, addToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!useProfileResume && !resumeFile) {
      return addToast('Please select a resume file to upload', 'warning');
    }
    if (useProfileResume && !user?.resume) {
      return addToast('No resume on profile, please upload one', 'warning');
    }

    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    if (!useProfileResume && resumeFile) {
      formData.append('resume', resumeFile);
    }

    dispatch(applyToJob({ jobId: id, formData }));
  };

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-28 flex-1 max-w-2xl mx-auto px-6 w-full pb-16">
        <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-xl space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Apply to Position</span>
            <h1 className="font-sans text-2xl font-black mt-2">{job?.title}</h1>
            <p className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm">{job?.company} • {job?.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume choice */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">
                Resume Attachment
              </label>

              {user?.resume && (
                <div className="flex items-center gap-3 p-3 bg-surface-container-low dark:bg-on-tertiary-fixed-variant rounded-xl">
                  <input
                    type="checkbox"
                    checked={useProfileResume}
                    onChange={(e) => setUseProfileResume(e.target.checked)}
                    className="rounded text-secondary focus:ring-secondary"
                  />
                  <div className="text-body-sm">
                    <span className="font-medium">Use my profile resume</span>
                    <a href={user.resume} target="_blank" rel="noreferrer" className="text-secondary hover:underline block text-[12px]">
                      View resume
                    </a>
                  </div>
                </div>
              )}

              {(!useProfileResume || !user?.resume) && (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="text-body-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-surface-container file:text-body-sm file:font-semibold hover:file:bg-outline-variant/40 file:cursor-pointer"
                  />
                  <p className="text-[11px] text-on-surface-variant">PDF, DOC, DOCX up to 5MB</p>
                </div>
              )}
            </div>

            {/* Cover letter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">
                Cover Letter / Message to Recruiter
              </label>
              <textarea
                rows={6}
                placeholder="Explain why you are a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-secondary/25"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary dark:bg-white dark:text-primary py-4 rounded-xl font-bold text-body-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationFormPage;
