import React from 'react';

const BarChart = ({ data }) => {
  // Ensure we have fallback data if empty
  const chartData = data && data.length > 0 ? data : [
    { label: '01 Nov', count: 12 },
    { label: '08 Nov', count: 25 },
    { label: '15 Nov', count: 18 },
    { label: '22 Nov', count: 42 },
    { label: '29 Nov', count: 35 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="w-full">
      <div className="relative h-64 w-full bg-gradient-to-b from-secondary/5 to-transparent rounded-xl border border-outline-variant/10 overflow-hidden flex items-end px-6 py-4 gap-4">
        {chartData.map((item, index) => {
          const heightPct = (item.count / maxVal) * 80 + 10; // scale between 10% and 90%
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 bg-primary text-white text-[11px] px-2 py-1 rounded bottom-full mb-1 transition-opacity duration-200 pointer-events-none">
                {item.count} applications
              </div>
              {/* Bar */}
              <div 
                style={{ height: `${heightPct}%` }}
                className="w-full bg-secondary/20 group-hover:bg-secondary rounded-t-lg transition-all duration-300 border-t-4 border-secondary/50 group-hover:border-secondary"
              ></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-4 text-[12px] text-on-surface-variant font-medium px-4">
        {chartData.map((item, index) => (
          <span key={index}>{item.label || item._id}</span>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
