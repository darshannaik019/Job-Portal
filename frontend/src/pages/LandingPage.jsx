import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice.js';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';

const LandingPage = () => {
  const { jobs, loading } = useSelector((state) => state.jobs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchJobs({ limit: 3 }));
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}&location=${location}`);
  };

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-20 flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-surface-bright dark:bg-primary-container/40">
          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-secondary dark:text-secondary-fixed-dim font-sans text-label-caps mb-6 uppercase tracking-wider font-semibold">
              The Future of Talent Acquisition
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold mb-6 max-w-3xl mx-auto leading-tight tracking-tight">
              Discover your professional <span className="text-secondary">destiny.</span>
            </h1>
            <p className="text-on-surface-variant dark:text-on-tertiary-container text-body-lg mb-12 max-w-2xl mx-auto">
              Connect with high-growth companies and find roles that align with your career trajectory. Our engine matches you with more than just a job.
            </p>

            {/* Search Bar Container */}
            <form onSubmit={handleSearchSubmit} className="glass-card p-4 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 shadow-xl bg-white dark:bg-primary-container">
              <div className="flex-1 w-full flex items-center px-4 py-2 gap-3 border-b md:border-b-0 md:border-r border-outline-variant/30">
                <span className="material-symbols-outlined text-outline">work</span>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface dark:text-white font-sans text-body-sm placeholder-on-surface-variant"
                />
              </div>
              <div className="flex-1 w-full flex items-center px-4 py-2 gap-3">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface dark:text-white font-sans text-body-sm placeholder-on-surface-variant"
                />
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto bg-primary text-on-primary dark:bg-white dark:text-primary px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all duration-200"
              >
                <span className="material-symbols-outlined">search</span>
                Search Jobs
              </button>
            </form>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap justify-center gap-12 md:gap-24">
              <div className="text-center">
                <p className="font-sans text-4xl font-extrabold text-primary dark:text-white mb-1">10k+</p>
                <p className="text-on-surface-variant dark:text-on-tertiary-container text-[11px] uppercase tracking-wider font-bold">Active Jobs</p>
              </div>
              <div className="text-center">
                <p className="font-sans text-4xl font-extrabold text-primary dark:text-white mb-1">500+</p>
                <p className="text-on-surface-variant dark:text-on-tertiary-container text-[11px] uppercase tracking-wider font-bold">Top Companies</p>
              </div>
              <div className="text-center">
                <p className="font-sans text-4xl font-extrabold text-primary dark:text-white mb-1">85k+</p>
                <p className="text-on-surface-variant dark:text-on-tertiary-container text-[11px] uppercase tracking-wider font-bold">Monthly Hires</p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Logo Carousel */}
        <div className="py-12 bg-surface dark:bg-primary-container/20 overflow-hidden border-y border-outline-variant/10">
          <div className="carousel-track">
            {['TECHNO', 'GLOBO', 'STRATOS', 'NEXUS', 'AURORA', 'TECHNO', 'GLOBO', 'STRATOS', 'NEXUS', 'AURORA'].map((logo, idx) => (
              <div key={idx} className="w-[250px] flex items-center justify-center grayscale opacity-50 dark:opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <span className="font-sans text-xl font-black opacity-45 text-primary dark:text-white">{logo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Opportunities Section */}
        <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-sans text-3xl font-extrabold mb-4 dark:text-white">Featured Opportunities</h2>
              <p className="text-on-surface-variant dark:text-on-tertiary-container">Selected roles from our premier partner network.</p>
            </div>
            <Link to="/jobs" className="text-secondary dark:text-secondary-fixed-dim font-semibold flex items-center gap-1 hover:underline transition-all">
              View All Jobs <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <LoadingSkeleton key={i} type="card" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs?.slice(0, 3).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </section>

        {/* Categories Grid (Bento Style) */}
        <section className="py-24 bg-surface-container-low dark:bg-primary-container/30">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-sans text-3xl font-extrabold mb-4 dark:text-white">Explore by Category</h2>
              <p className="text-on-surface-variant dark:text-on-tertiary-container">Find the perfect niche for your specific skill set.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div 
                onClick={() => navigate('/jobs?category=Engineering')}
                className="md:col-span-2 md:row-span-2 glass-card p-8 rounded-3xl group cursor-pointer hover:bg-primary dark:hover:bg-white transition-all duration-300"
              >
                <span className="material-symbols-outlined text-5xl text-secondary group-hover:text-on-primary dark:group-hover:text-primary mb-8 block transition-colors">code</span>
                <h4 className="font-sans text-2xl font-bold group-hover:text-on-primary dark:text-white dark:group-hover:text-primary transition-colors">Engineering</h4>
                <p className="text-on-surface-variant dark:text-on-tertiary-container group-hover:text-on-primary/70 dark:group-hover:text-primary/70 mb-8 transition-colors">Backend, Frontend, Fullstack, DevOps, and more.</p>
                <span className="font-bold text-primary dark:text-white group-hover:text-on-primary dark:group-hover:text-primary flex items-center gap-2 transition-colors">
                  Browse openings <span className="material-symbols-outlined">trending_flat</span>
                </span>
              </div>
              <div onClick={() => navigate('/jobs?category=Design')} className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl">palette</span>
                <h4 className="font-sans text-lg font-bold mb-2 dark:text-white">Design</h4>
                <span className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm">UI/UX, Product, Graphic Design</span>
              </div>
              <div onClick={() => navigate('/jobs?category=Sales')} className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl">trending_up</span>
                <h4 className="font-sans text-lg font-bold mb-2 dark:text-white">Sales</h4>
                <span className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm">Enterprise, Account Executive</span>
              </div>
              <div onClick={() => navigate('/jobs?category=Human Resources')} className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl">person</span>
                <h4 className="font-sans text-lg font-bold mb-2 dark:text-white">Human Resources</h4>
                <span className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm">People Partner, Talent Sourcing</span>
              </div>
              <div onClick={() => navigate('/jobs?category=Finance')} className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl">payments</span>
                <h4 className="font-sans text-lg font-bold mb-2 dark:text-white">Finance</h4>
                <span className="text-on-surface-variant dark:text-on-tertiary-container text-body-sm">Accountant, CFO Advisor</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="bg-primary-container dark:bg-black/40 rounded-[40px] overflow-hidden p-12 md:p-20 relative border border-outline-variant/10">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="material-symbols-outlined text-secondary text-[64px] mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>
                  format_quote
                </span>
                <h2 className="font-sans text-3xl font-bold text-on-primary dark:text-white mb-8">
                  CareerPartner transformed my job hunt from a chore into a curated experience.
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary">
                    <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80" alt="Sarah Jenkins" />
                  </div>
                  <div>
                    <p className="text-on-primary dark:text-white font-bold text-body-sm">Sarah Jenkins</p>
                    <p className="text-on-primary-container dark:text-on-tertiary-container text-body-sm">Product Manager at TechNova</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="glass-card bg-white/5 p-6 rounded-2xl border-white/10">
                    <p className="text-on-primary dark:text-white font-bold text-4xl">98%</p>
                    <p className="text-on-primary-container dark:text-on-tertiary-container text-body-sm">Placement Rate</p>
                  </div>
                  <div className="glass-card bg-white/5 p-6 rounded-2xl border-white/10">
                    <p className="text-on-primary dark:text-white font-bold text-4xl">15d</p>
                    <p className="text-on-primary-container dark:text-on-tertiary-container text-body-sm">Avg. Hire Time</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="glass-card bg-white/5 p-6 rounded-2xl border-white/10">
                    <p className="text-on-primary dark:text-white font-bold text-4xl">400k+</p>
                    <p className="text-on-primary-container dark:text-on-tertiary-container text-body-sm">Active Users</p>
                  </div>
                  <div className="glass-card bg-white/5 p-6 rounded-2xl border-white/10">
                    <p className="text-on-primary dark:text-white font-bold text-4xl">5/5</p>
                    <p className="text-on-primary-container dark:text-on-tertiary-container text-body-sm">Candidate Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center bg-surface-bright dark:bg-primary-container/20">
          <div className="max-w-2xl mx-auto px-margin-mobile">
            <h2 className="font-sans text-3xl font-extrabold mb-6 dark:text-white">Ready to find your next adventure?</h2>
            <p className="text-on-surface-variant dark:text-on-tertiary-container mb-10">Join thousands of professionals who have found their dream roles through CareerPartner.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="bg-primary text-on-primary dark:bg-white dark:text-primary px-8 py-4 rounded-xl font-bold w-full sm:w-auto hover:bg-secondary dark:hover:bg-secondary hover:text-white transition-all text-center">
                Get Started for Free
              </Link>
              <Link to="/jobs" className="border border-outline px-8 py-4 rounded-xl font-bold w-full sm:w-auto hover:bg-surface-container dark:hover:bg-on-tertiary-fixed-variant transition-all text-center">
                Browse All Jobs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
