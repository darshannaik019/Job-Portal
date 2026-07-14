import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, uploadUserResume, uploadUserPhoto, clearUserState } from '../redux/slices/userSlice.js';
import { loadUser } from '../redux/slices/authSlice.js';
import Sidebar from '../components/common/Sidebar.jsx';
import useToast from '../hooks/useToast.js';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const addToast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { success, error, loading } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');

  // Education list
  const [education, setEducation] = useState([]);
  const [newEdu, setNewEdu] = useState({ degree: '', school: '', startYear: '', endYear: '' });

  // Experience list
  const [experience, setExperience] = useState([]);
  const [newExp, setNewExp] = useState({ title: '', company: '', startDate: '', endDate: '', description: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setSkills(user.skills?.join(', ') || '');
      setEducation(user.education || []);
      setExperience(user.experience || []);
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      addToast('Profile updated successfully!', 'success');
      dispatch(clearUserState());
      dispatch(loadUser());
    }
    if (error) {
      addToast(error, 'error');
      dispatch(clearUserState());
    }
  }, [success, error, dispatch, addToast]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
    dispatch(updateUserProfile({ name, phone, skills: skillsArray, education, experience }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const action = await dispatch(uploadUserPhoto(file));
      if (uploadUserPhoto.fulfilled.match(action)) {
        addToast('Profile photo updated!', 'success');
        dispatch(loadUser());
      } else {
        addToast(action.payload || 'Failed to upload photo', 'error');
      }
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const action = await dispatch(uploadUserResume(file));
      if (uploadUserResume.fulfilled.match(action)) {
        addToast('Resume uploaded and synced!', 'success');
        dispatch(loadUser());
      } else {
        addToast(action.payload || 'Failed to upload resume', 'error');
      }
    }
  };

  const addEducation = () => {
    if (!newEdu.degree || !newEdu.school) return addToast('Degree and School are required', 'warning');
    setEducation([...education, newEdu]);
    setNewEdu({ degree: '', school: '', startYear: '', endYear: '' });
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    if (!newExp.title || !newExp.company) return addToast('Title and Company are required', 'warning');
    setExperience([...experience, newExp]);
    setNewExp({ title: '', company: '', startDate: '', endDate: '', description: '' });
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-surface dark:bg-primary-container/20 text-on-surface dark:text-white min-h-screen flex transition-colors">
      <Sidebar />

      <main className="ml-[280px] flex-1 min-h-screen flex flex-col justify-between">
        <div>
          <header className="sticky top-0 w-full z-40 bg-surface/85 dark:bg-primary-container/85 backdrop-blur-xl border-b border-outline-variant/10 h-20 flex items-center justify-between px-margin-desktop shadow-sm">
            <span className="font-sans text-xl font-bold">My Career Profile</span>
          </header>

          <div className="p-margin-desktop space-y-8 max-w-4xl">
            {/* Photo & Resume Card */}
            <div className="glass-card p-6 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow flex flex-col md:flex-row gap-8 items-center">
              <div className="relative group">
                <img
                  className="w-24 h-24 rounded-full object-cover border-2 border-secondary"
                  src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                  alt={user?.name}
                />
                <label className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="material-symbols-outlined">edit</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-3 w-full text-center md:text-left">
                <h3 className="font-sans text-lg font-bold">{user?.name}</h3>
                <p className="text-body-sm text-on-surface-variant dark:text-on-tertiary-container">{user?.email}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div>
                    <label className="bg-primary text-on-primary dark:bg-white dark:text-primary px-4 py-2 rounded-xl text-[12px] font-bold cursor-pointer inline-block hover:opacity-90">
                      Upload Resume
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                    </label>
                  </div>
                  {user?.resume && (
                    <a href={user.resume} target="_blank" rel="noreferrer" className="text-secondary font-semibold text-body-sm flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-sm">download</span> View Current Resume
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md space-y-6">
                <h3 className="font-sans text-lg font-bold border-b border-outline-variant/10 pb-4">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-tertiary-container">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Product Design"
                      className="bg-surface-container-low dark:bg-on-tertiary-fixed-variant border-none rounded-xl text-body-sm px-4 py-2.5 text-on-surface dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Education section */}
              <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md space-y-6">
                <h3 className="font-sans text-lg font-bold border-b border-outline-variant/10 pb-4">Education History</h3>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-surface-container-low dark:bg-on-tertiary-fixed-variant/40 p-4 rounded-xl">
                      <div>
                        <p className="font-bold text-body-sm">{edu.degree}</p>
                        <p className="text-on-surface-variant dark:text-on-tertiary-container text-[12px]">{edu.school} • {edu.startYear} - {edu.endYear}</p>
                      </div>
                      <button type="button" onClick={() => removeEducation(idx)} className="text-error hover:opacity-80">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low dark:bg-on-tertiary-fixed-variant/20 p-4 rounded-xl">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="School"
                    value={newEdu.school}
                    onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Start Year"
                    value={newEdu.startYear}
                    onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="End Year"
                    value={newEdu.endYear}
                    onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <button type="button" onClick={addEducation} className="col-span-1 md:col-span-4 bg-secondary text-on-primary py-2 rounded-lg font-bold text-body-sm">
                    Add Education Record
                  </button>
                </div>
              </div>

              {/* Experience section */}
              <div className="glass-card p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-md space-y-6">
                <h3 className="font-sans text-lg font-bold border-b border-outline-variant/10 pb-4">Professional Experience</h3>

                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-surface-container-low dark:bg-on-tertiary-fixed-variant/40 p-4 rounded-xl">
                      <div>
                        <p className="font-bold text-body-sm">{exp.title} at {exp.company}</p>
                        <p className="text-on-surface-variant dark:text-on-tertiary-container text-[12px]">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-[12px] mt-1 italic">{exp.description}</p>
                      </div>
                      <button type="button" onClick={() => removeExperience(idx)} className="text-error hover:opacity-80">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container-low dark:bg-on-tertiary-fixed-variant/20 p-4 rounded-xl">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={newExp.title}
                    onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={newExp.startDate}
                    onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={newExp.endDate}
                    onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                    className="bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <textarea
                    placeholder="Description / Responsibilities"
                    rows={2}
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    className="col-span-1 md:col-span-2 bg-white dark:bg-primary-container border border-outline-variant/20 rounded-lg text-body-sm px-3 py-1.5 text-on-surface dark:text-white"
                  />
                  <button type="button" onClick={addExperience} className="col-span-1 md:col-span-2 bg-secondary text-on-primary py-2 rounded-lg font-bold text-body-sm">
                    Add Experience Record
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary dark:bg-white dark:text-primary py-4 rounded-xl font-bold text-body-sm hover:opacity-90 transition-opacity"
              >
                {loading ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
