import React from 'react';

const SidebarTables = ({ tables, selectedTable, onSelect }) => {
  return (
    <aside className="data-explorer-sidebar">
      <div className="data-explorer-sidebar__header">
        <h3>Database Tables</h3>
        <p>Browse live datasets by table.</p>
      </div>
      <div className="data-explorer-sidebar__list">
        {tables.map((table) => {
          const isActive = selectedTable?.value === table.value;
          return (
            <button
              key={table.value}
              type="button"
              className={`data-explorer-sidebar__item${isActive ? ' is-active' : ''}`}
              onClick={() => onSelect(table)}
            >
              <span>{table.label}</span>
              {table.description && <small>{table.description}</small>}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default SidebarTables;
