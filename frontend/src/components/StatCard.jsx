import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'purple' }) => {
  const colorMap = {
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-[#534AB7]',
      border: 'border-purple-100'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-100'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100'
    }
  };

  const selectedColor = colorMap[color] || colorMap.purple;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${selectedColor.border} p-3 flex items-center justify-between`}>
      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-lg font-bold text-gray-800 mt-0.5">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${selectedColor.bg} ${selectedColor.icon}`}>
        {Icon && <Icon size={18} />}
      </div>
    </div>
  );
};

export default StatCard;
