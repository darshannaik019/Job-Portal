import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs } from '../redux/slices/jobSlice.js';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import FilterBar from '../components/jobs/FilterBar.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';

const BrowseJobs = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { jobs, pagination, loading, error } = useSelector((state) => state.jobs);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: '',
    experience: '',
    salaryMin: '',
  });

  useEffect(() => {
    dispatch(fetchJobs({ ...filters, page: currentPage }));
  }, [dispatch, filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-28 flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full space-y-8">
        <div>
          <h1 className="font-sans text-3xl font-extrabold mb-2">Browse Opportunities</h1>
          <p className="text-on-surface-variant dark:text-on-tertiary-container">
            Discover roles that align with your career trajectory and technical expertise.
          </p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-error text-5xl">warning</span>
            <p className="text-on-surface-variant dark:text-on-tertiary-container mt-4">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-surface dark:bg-primary-container/20 border border-outline-variant/10 rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant">find_in_page</span>
            <h3 className="font-sans text-lg font-bold mt-4">No Jobs Found</h3>
            <p className="text-on-surface-variant dark:text-on-tertiary-container mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-outline-variant/20 rounded-lg text-body-sm font-semibold disabled:opacity-50 hover:bg-surface-container transition-colors"
                >
                  Previous
                </button>
                <span className="text-body-sm font-medium text-on-surface dark:text-white">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-outline-variant/20 rounded-lg text-body-sm font-semibold disabled:opacity-50 hover:bg-surface-container transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseJobs;
