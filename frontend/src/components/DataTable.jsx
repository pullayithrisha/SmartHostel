import React from 'react';

const DataTable = ({ columns, rows = [], loading = false }) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-sm text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">📭</span>
                  <span>No records found.</span>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, rIdx) => (
              <tr
                key={row._id || rIdx}
                className={`hover:bg-gray-50/50 transition-colors text-sm text-gray-700 ${
                  rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/10'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
