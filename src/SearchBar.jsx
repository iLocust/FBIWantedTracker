import PropTypes from 'prop-types';

function SearchBar({ searchQuery, onSearchChange, onSearchSubmit }) {
  return (
    <form onSubmit={onSearchSubmit} className="mb-6 flex items-center space-x-2">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
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
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
