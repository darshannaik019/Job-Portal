import React from 'react';

const LoadingSkeleton = ({ type = 'dashboard' }) => {
  if (type === 'card') {
    return (
      <div className="bg-surface-container-lowest dark:bg-primary-container p-6 rounded-2xl border border-outline-variant/10 animate-pulse space-y-4 shadow">
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-xl"></div>
          <div className="w-16 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-lg"></div>
        </div>
        <div className="h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded w-3/4"></div>
        <div className="h-4 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded w-1/2"></div>
        <div className="flex gap-2 pt-2">
          <div className="w-12 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
          <div className="w-12 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="w-24 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
          <div className="w-16 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-t"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-outline-variant/10">
            <div className="flex-1 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
            <div className="flex-1 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
            <div className="flex-1 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded"></div>
            <div className="w-24 h-6 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Dashboard skeleton (Default)
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 h-60 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-2xl"></div>
        <div className="col-span-12 lg:col-span-4 h-60 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-2xl"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-surface-container-high dark:bg-on-tertiary-fixed-variant rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
