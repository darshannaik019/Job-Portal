import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    jobType: '',
    experience: '',
    salaryMin: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const cleared = {
      search: '',
      location: '',
      category: '',
      jobType: '',
      experience: '',
      salaryMin: '',
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="glass-card p-6 rounded-2xl w-full flex flex-col gap-4 shadow-md bg-white dark:bg-primary-container">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Title, Company..."
            className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-lg text-body-sm px-3 py-2 text-on-surface dark:text-white"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Zurich, Remote..."
            className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-lg text-body-sm px-3 py-2 text-on-surface dark:text-white"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-lg text-body-sm px-3 py-2 text-on-surface dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Job Type */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Job Type</label>
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
            className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-lg text-body-sm px-3 py-2 text-on-surface dark:text-white"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Min Salary */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Min Salary ($)</label>
          <input
            type="number"
            name="salaryMin"
            value={filters.salaryMin}
            onChange={handleChange}
            placeholder="e.g. 80000"
            className="w-full bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-lg text-body-sm px-3 py-2 text-on-surface dark:text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-end">
          <button
            onClick={handleClear}
            className="w-full bg-outline-variant/30 text-on-surface-variant dark:text-on-tertiary-container hover:bg-outline-variant/50 transition-colors py-2 rounded-lg font-semibold text-body-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
