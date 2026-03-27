import React from 'react';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="data-explorer-search">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || 'Search rows...'}
        aria-label="Search rows"
      />
    </div>
  );
};

export default SearchBar;
