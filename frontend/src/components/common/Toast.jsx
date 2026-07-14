import React from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  const styles = {
    success: {
      border: 'border-l-4 border-l-secondary',
      icon: 'check_circle',
      iconColor: 'text-secondary',
    },
    error: {
      border: 'border-l-4 border-l-error',
      icon: 'error',
      iconColor: 'text-error',
    },
    warning: {
      border: 'border-l-4 border-l-amber-500',
      icon: 'warning',
      iconColor: 'text-amber-500',
    },
    info: {
      border: 'border-l-4 border-l-primary',
      icon: 'info',
      iconColor: 'text-primary dark:text-white',
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className={`glass-card p-4 rounded-xl flex items-center justify-between gap-4 ${currentStyle.border} shadow-lg animate-slide-in`}>
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined ${currentStyle.iconColor}`}>
          {currentStyle.icon}
        </span>
        <p className="text-body-sm font-medium text-on-surface dark:text-white">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="text-on-surface-variant hover:text-on-surface dark:text-on-tertiary-container dark:hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
};

export default Toast;
