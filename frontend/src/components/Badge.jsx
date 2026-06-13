import React from 'react';

const Badge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : '';

  const styles = {
    'paid': 'bg-green-100 text-green-800 border border-green-200',
    'available': 'bg-green-100 text-green-800 border border-green-200',
    'approved': 'bg-green-100 text-green-800 border border-green-200',
    'active': 'bg-green-100 text-green-800 border border-green-200',
    'resolved': 'bg-green-100 text-green-800 border border-green-200',
    'pending': 'bg-amber-100 text-amber-800 border border-amber-200',
    'occupied': 'bg-amber-100 text-amber-800 border border-amber-200',
    'pending approval': 'bg-amber-100 text-amber-800 border border-amber-200',
    'review': 'bg-blue-100 text-blue-800 border border-blue-200',
    'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
    'overdue': 'bg-red-100 text-red-800 border border-red-200',
    'maintenance': 'bg-red-100 text-red-800 border border-red-200',
  };

  const currentStyle = styles[normalized] || 'bg-gray-100 text-gray-800 border border-gray-200';

  // Format label nicely
  const getLabel = (str) => {
    if (str === 'in-progress') return 'In Progress';
    if (str === 'pending approval') return 'Pending Approval';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${currentStyle}`}>
      {getLabel(status)}
    </span>
  );
};

export default Badge;
