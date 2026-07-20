import React, { useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

const ResourcesPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      id: 'resume',
      title: 'Resume Parsing & Optimization',
      icon: 'description',
      tag: 'Application Stage',
      summary: 'Learn how to construct your resume text to match automated Applicant Tracking Systems and Gemini matching models.',
      details: [
        'Use clean hierarchy: Keep headings standard like "Experience", "Education", and "Skills". Avoid custom styling.',
        'Inject key requirements: Read job requirement lists and explicitly include matching skill terms in your resume.',
        'Use standard PDF text format: Ensure your PDF resume contains readable text rather than rasterized images of text.',
        'Keep bullet points result-driven: Focus on quantitative metrics (e.g. "Improved pipeline efficiency by 30%").'
      ]
    },
    {
      id: 'interview',
      title: 'Coding & System Design Prep',
      icon: 'code',
      tag: 'Technical Stage',
      summary: 'Step-by-step strategies to tackle whiteboard, take-home assignments, and system design interviews.',
      details: [
        'Master core Data Structures: Focus on arrays, maps, trees, queues, and graph search algorithms.',
        'Clarify constraints: Before coding, speak aloud to clarify scale boundaries, inputs, and edge cases.',
        'Build modular layouts: Write clean helper methods and functions rather than single massive code blocks.',
        'Explain trade-offs: Be prepared to discuss Time/Space complexity (Big O) and network overhead comparisons.'
      ]
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interviews: STAR Method',
      icon: 'group',
      tag: 'Culture Fit',
      summary: 'How to structure your project history and soft skill responses using Situation, Task, Action, and Result.',
      details: [
        'Situation: Briefly set the context of the project, detailing the team size and your core role.',
        'Task: Describe the specific bottleneck or problem that needed immediate remediation.',
        'Action: Detail the actions YOU took, the technologies used, and how you coordinated details.',
        'Result: Highlight the quantitative outcome, learnings, and positive takeaways of the project.'
      ]
    },
    {
      id: 'negotiation',
      title: 'Salary Negotiation Guide',
      icon: 'payments',
      tag: 'Offer Stage',
      summary: 'Strategies to leverage database salary averages to negotiate compensation packages confidently.',
      details: [
        'Research local stats: Reference our Salaries page averages to understand average category bounds.',
        'Let the employer state the number first: Avoid disclosing your current pay rate or target bounds too early.',
        'Factor in total package value: Negotiate stock options, health benefits, PTO, and signing bonuses.',
        'Stay professional and collaborative: Position negotiation as a mutual partnership alignment.'
      ]
    }
  ];

  return (
    <div className="bg-background dark:bg-primary-container text-on-surface dark:text-white min-h-screen flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="pt-28 flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full space-y-12 pb-16">
        <div className="text-center md:text-left space-y-2">
          <h1 className="font-sans text-3xl font-extrabold tracking-tight">Career Development Resources</h1>
          <p className="text-on-surface-variant dark:text-on-tertiary-container max-w-2xl text-body-sm">
            Access free guidelines, preparation checklists, and strategic instructions compiled to help you land your dream opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((t) => (
            <div 
              key={t.id} 
              className="glass-card p-6 md:p-8 rounded-3xl bg-white dark:bg-primary-container border border-outline-variant/10 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">{t.icon}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant dark:bg-on-tertiary-fixed-variant/40 dark:text-white">
                    {t.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans text-lg font-bold">{t.title}</h3>
                  <p className="text-body-sm text-on-surface-variant dark:text-on-tertiary-container leading-relaxed">
                    {t.summary}
                  </p>
                </div>
              </div>

              <div>
                {selectedTopic === t.id ? (
                  <div className="mt-4 pt-4 border-t border-outline-variant/10 space-y-3 animate-fade-in">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-secondary">Preparation Checklist:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-on-surface-variant dark:text-on-tertiary-container leading-relaxed">
                      {t.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setSelectedTopic(null)}
                      className="mt-4 text-xs font-bold text-on-surface-variant hover:text-secondary underline transition-colors"
                    >
                      Hide Details
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedTopic(t.id)}
                    className="w-full mt-4 bg-secondary/10 hover:bg-secondary/20 text-secondary py-3 rounded-xl font-bold transition-all text-body-sm flex items-center justify-center gap-2"
                  >
                    View Guide Details
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
