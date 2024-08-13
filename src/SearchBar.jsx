import { useState } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ onSearchSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex items-center space-x-2">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name..."
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-400 transition duration-200"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
      >
        Search
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  onSearchSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
