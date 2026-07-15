import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import store from './redux/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_') && !PUBLISHABLE_KEY.includes('placeholder');

const ClerkSetupAlert = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">Clerk Auth Setup Required</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          To run the application, you need to configure your Clerk environment variables.
        </p>
        <div className="bg-slate-950/60 rounded-2xl p-4 text-left border border-slate-800/50 mb-6 space-y-3 font-mono text-xs text-slate-300">
          <div>
            <span className="text-rose-400"># In /frontend/.env</span>
            <div className="mt-1 select-all bg-slate-950 p-2.5 rounded-lg border border-slate-900 overflow-x-auto text-[11px]">
              VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
            </div>
          </div>
          <div>
            <span className="text-rose-400"># In /backend/.env</span>
            <div className="mt-1 select-all bg-slate-950 p-2.5 rounded-lg border border-slate-900 overflow-x-auto text-[11px]">
              CLERK_PUBLISHABLE_KEY=pk_test_...
              <br />
              CLERK_SECRET_KEY=sk_test_...
            </div>
          </div>
        </div>
        <a 
          href="https://dashboard.clerk.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm shadow-lg shadow-blue-500/20"
        >
          Get API Keys from Clerk
        </a>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Provider store={store}>
          <ThemeProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ThemeProvider>
        </Provider>
      </ClerkProvider>
    ) : (
      <ClerkSetupAlert />
    )}
  </React.StrictMode>
);
