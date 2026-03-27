import React, { useEffect, useMemo, useState } from 'react';
import { getTableData } from '../services/api';
import SidebarTables from '../components/dataExplorer/SidebarTables';
import SearchBar from '../components/dataExplorer/SearchBar';
import DataTable from '../components/dataExplorer/DataTable';
import PaginationControls from '../components/dataExplorer/PaginationControls';

const TABLES = [
  { label: 'Donors', value: 'donors', description: 'Registered donors list' },
  { label: 'Blood Units', value: 'inventory', description: 'Inventory from Blood_Unit' },
  { label: 'Requests', value: 'requests', description: 'Hospital requests workflow' },
  { label: 'Hospitals', value: 'hospitals', description: 'Partner hospital records' }
];

const ROWS_PER_PAGE = 10;

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

const compareValues = (a, b) => {
  const normalizedA = normalizeValue(a);
  const normalizedB = normalizeValue(b);

  const numberA = Number(normalizedA);
  const numberB = Number(normalizedB);
  if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
    return numberA - numberB;
  }

  const dateA = Date.parse(normalizedA);
  const dateB = Date.parse(normalizedB);
  if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
    return dateA - dateB;
  }

  return normalizedA.localeCompare(normalizedB);
};

const DataExplorer = () => {
  const [selectedTable, setSelectedTable] = useState(TABLES[0]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTable = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getTableData(selectedTable.value);
        const payload = response.data?.data ?? response.data ?? [];
        setTableData(Array.isArray(payload) ? payload : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load table data.');
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [selectedTable]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTable, debouncedQuery]);

  const columns = useMemo(() => {
    if (tableData.length === 0) {
      return [];
    }
    return Object.keys(tableData[0]);
  }, [tableData]);

  const filteredRows = useMemo(() => {
    if (!debouncedQuery) {
      return tableData;
    }
    const query = debouncedQuery.toLowerCase();
    return tableData.filter((row) =>
      columns.some((column) => normalizeValue(row[column]).toLowerCase().includes(query))
    );
  }, [tableData, columns, debouncedQuery]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) {
      return filteredRows;
    }
    const sorted = [...filteredRows];
    sorted.sort((a, b) => {
      const compare = compareValues(a[sortConfig.key], b[sortConfig.key]);
      return sortConfig.direction === 'asc' ? compare : -compare;
    });
    return sorted;
  }, [filteredRows, sortConfig]);

  const totalPages = Math.ceil(sortedRows.length / ROWS_PER_PAGE);
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.key === column) {
        return { key: column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: column, direction: 'asc' };
    });
  };

  return (
    <div className="data-explorer-shell">
      <div className="data-explorer-header">
        <div>
          <h1>Data Explorer</h1>
          <p>Inspect live database tables with search, sorting, and pagination.</p>
        </div>
        <div className="data-explorer-header__meta">
          <span>Active table</span>
          <strong>{selectedTable.label}</strong>
          <span>{filteredRows.length} rows</span>
        </div>
      </div>

      <div className="data-explorer">
        <SidebarTables
          tables={TABLES}
          selectedTable={selectedTable}
          onSelect={setSelectedTable}
        />

        <section className="data-explorer-main">
          <div className="data-explorer-controls">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search across all columns..."
            />
          </div>

          <div className="data-explorer-card">
            {loading && <div className="data-explorer-state">Loading table...</div>}
            {!loading && error && <div className="data-explorer-state is-error">{error}</div>}
            {!loading && !error && columns.length === 0 && (
              <div className="data-explorer-state">No data available for this table.</div>
            )}
            {!loading && !error && columns.length > 0 && (
              <>
                <DataTable
                  columns={columns}
                  rows={paginatedRows}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  onNext={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataExplorer;
