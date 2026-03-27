import React from 'react';

const DataTable = ({ columns, rows, sortConfig, onSort }) => {
  const handleSort = (column) => {
    if (!onSort) {
      return;
    }
    onSort(column);
  };

  return (
    <div className="data-explorer-table">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => {
              const isActive = sortConfig?.key === column;
              const direction = isActive ? sortConfig.direction : null;
              const handleKeyDown = (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleSort(column);
                }
              };
              return (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  onKeyDown={handleKeyDown}
                  role="button"
                  tabIndex={0}
                >
                  <span className="data-table__header">
                    {column}
                    {isActive && (
                      <span className="data-table__sort">
                        {direction === 'asc' ? '^' : 'v'}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((column) => (
                <td key={column}>{row[column] ?? '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
