import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import api from '../utils/api.js';

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/jobs/companies');
        setCompanies(data.companies || []);
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompanyClick = (companyName) => {
    // Navigate to BrowseJobs with search filter
    navigate(`/jobs?search=${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-28 flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full space-y-8 pb-16">
        <div className="text-center md:text-left space-y-2">
          <h1 className="font-sans text-3xl font-extrabold tracking-tight">Explore Top Employers</h1>
          <p className="text-on-surface-variant dark:text-on-tertiary-container max-w-2xl text-body-sm">
            Discover companies listing active opportunities, filtering by locations, job categories, and vacancy counts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full bg-white dark:bg-primary-container border border-outline-variant/10 rounded-2xl p-2 flex items-center shadow-sm">
          <span className="material-symbols-outlined text-on-surface-variant px-3">search</span>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-body-sm text-on-surface dark:text-white placeholder-on-surface-variant focus:outline-none py-2"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 bg-surface dark:bg-primary-container/20 border border-outline-variant/10 rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant">corporate_fare</span>
            <h3 className="font-sans text-lg font-bold mt-4">No Companies Found</h3>
            <p className="text-on-surface-variant dark:text-on-tertiary-container mt-1">We couldn't find any companies matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((c) => (
              <div 
                key={c.company}
                onClick={() => handleCompanyClick(c.company)}
                className="glass-card p-6 rounded-2xl bg-white dark:bg-primary-container/45 border border-outline-variant/10 shadow-sm hover:border-secondary/30 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-2xl font-black uppercase">
                      {c.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-sans text-base font-bold group-hover:text-secondary transition-colors truncate max-w-[180px]">{c.company}</h4>
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-secondary/10 text-secondary">
                        {c.openJobs} Open Role{c.openJobs !== 1 && 's'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-on-surface-variant dark:text-on-tertiary-container">
                    {c.locations?.length > 0 && (
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{c.locations.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {c.categories?.length > 0 && (
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-sm">category</span>
                        <span>{c.categories.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between text-body-sm text-secondary font-bold">
                  <span>Browse Jobs</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompaniesPage;
