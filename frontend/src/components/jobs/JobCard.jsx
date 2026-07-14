import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSaveJob } from '../../redux/slices/userSlice.js';
import { loadUser } from '../../redux/slices/authSlice.js';

const JobCard = ({ job }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isSaved = user?.savedJobs?.includes(job._id);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    await dispatch(toggleSaveJob(job._id));
    dispatch(loadUser());
  };

  return (
    <div className="group bg-surface-container-lowest dark:bg-primary-container p-6 rounded-2xl job-card-shadow border border-outline-variant/10 transition-all duration-300 hover:translate-y-[-4px] flex flex-col justify-between h-[320px]">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-xl overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-outline text-3xl">corporate_fare</span>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-secondary-container/30 dark:bg-secondary-fixed/20 text-on-secondary-container dark:text-secondary-fixed-dim font-sans text-[10px] rounded-lg uppercase font-semibold">
              {job.jobType}
            </span>
            {isAuthenticated && (
              <button 
                onClick={handleSave} 
                className={`transition-colors ${isSaved ? 'text-secondary' : 'text-on-surface-variant dark:text-on-tertiary-container'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                  bookmark
                </span>
              </button>
            )}
          </div>
        </div>

        <Link to={`/jobs/${job._id}`}>
          <h3 className="font-sans text-title-md font-bold mb-2 group-hover:text-secondary dark:text-white dark:group-hover:text-secondary transition-colors truncate">
            {job.title}
          </h3>
        </Link>
        <p className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">apartment</span> {job.company} • {job.location}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements?.slice(0, 2).map((req, i) => (
            <span key={i} className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant px-3 py-1 rounded text-[12px] text-on-surface-variant dark:text-on-tertiary-container">
              {req}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
        <span className="font-bold text-primary dark:text-white font-sans">
          ${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k
        </span>
        <Link 
          to={`/jobs/${job._id}`} 
          className="text-on-surface dark:text-white hover:text-secondary dark:hover:text-secondary transition-colors font-semibold flex items-center gap-1 text-body-sm"
        >
          Apply <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
