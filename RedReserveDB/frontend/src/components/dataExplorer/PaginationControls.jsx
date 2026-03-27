import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPrev, onNext }) => {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className="data-explorer-pagination">
      <button type="button" className="btn ghost" onClick={onPrev} disabled={isFirst}>
        <span aria-hidden="true">&lt;</span> Previous
      </button>
      <span>
        Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
      </span>
      <button type="button" className="btn ghost" onClick={onNext} disabled={isLast || totalPages === 0}>
        Next <span aria-hidden="true">&gt;</span>
      </button>
    </div>
  );
};

export default PaginationControls;
