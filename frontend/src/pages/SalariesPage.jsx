import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import api from '../utils/api.js';

const SalariesPage = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userTargetSalary, setUserTargetSalary] = useState(80000);

  // Fallback salary values if database is empty
  const fallbackSalaries = [
    { category: 'Software Engineering', avgMin: 85000, avgMax: 165000, jobCount: 12 },
    { category: 'Data Science', avgMin: 90000, avgMax: 175000, jobCount: 8 },
    { category: 'Marketing', avgMin: 50000, avgMax: 110000, jobCount: 5 },
    { category: 'Human Resources', avgMin: 45000, avgMax: 95000, jobCount: 4 },
    { category: 'Sales & Business', avgMin: 55000, avgMax: 125000, jobCount: 7 },
  ];

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/jobs/salaries');
        // Use backend salaries or fallback if database returns empty
        if (data.salaries && data.salaries.length > 0) {
          setSalaries(data.salaries);
        } else {
          setSalaries(fallbackSalaries);
        }
      } catch (err) {
        console.error('Error fetching salaries:', err);
        setSalaries(fallbackSalaries);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const handleSearchJobsBySalary = (minVal) => {
    navigate(`/jobs?salaryMin=${minVal}`);
  };

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-28 flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full space-y-12 pb-16">
        <div className="text-center md:text-left space-y-2">
          <h1 className="font-sans text-3xl font-extrabold tracking-tight">Career Salary Insights</h1>
          <p className="text-on-surface-variant dark:text-on-tertiary-container max-w-2xl text-body-sm">
            Review average salary bounds across popular industry domains, aggregated dynamically from active job postings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Salary List Card */}
          <div className="lg:col-span-8 glass-card p-6 md:p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-sm space-y-6">
            <h3 className="font-sans text-lg font-bold">Salary Averages by Domain</h3>
            
            {loading ? (
              <div className="space-y-4">
                <LoadingSkeleton type="table" />
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {salaries.map((s) => (
                  <div key={s.category} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    <div className="space-y-1">
                      <h4 className="font-sans text-body-sm font-bold group-hover:text-secondary transition-colors">{s.category}</h4>
                      <p className="text-xs text-on-surface-variant dark:text-on-tertiary-container">{s.jobCount} open position{s.jobCount !== 1 && 's'}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-body-sm font-black text-on-surface dark:text-white">
                          ${s.avgMin.toLocaleString()} - ${s.avgMax.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-on-surface-variant dark:text-on-tertiary-container uppercase font-bold tracking-wider">Average Range</p>
                      </div>

                      <button 
                        onClick={() => handleSearchJobsBySalary(s.avgMin)}
                        className="bg-secondary/15 hover:bg-secondary text-secondary hover:text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                        title="View Jobs in this range"
                      >
                        <span className="material-symbols-outlined text-sm">search</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Calculator Slider */}
          <div className="lg:col-span-4 glass-card p-6 md:p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-sm flex flex-col justify-between h-[360px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">payments</span>
                <h3 className="font-sans text-lg font-bold">Salary Filter</h3>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-on-tertiary-container">
                Move the slider to estimate how many opportunities match your target base pay rate.
              </p>
              
              <div className="pt-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Min Salary</span>
                  <span className="text-xl font-black text-secondary">${userTargetSalary.toLocaleString()}</span>
                </div>

                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={userTargetSalary}
                  onChange={(e) => setUserTargetSalary(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer h-2 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-lg appearance-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleSearchJobsBySalary(userTargetSalary)}
              className="w-full bg-secondary text-on-primary py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-98 transition-all text-body-sm shadow-md"
            >
              View Jobs Above ${userTargetSalary.toLocaleString()}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalariesPage;
