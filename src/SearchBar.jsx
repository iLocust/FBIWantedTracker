
import PropTypes from 'prop-types';

function SearchBar({ searchQuery, onSearchChange, onSearchSubmit }) {
  return (
    <form onSubmit={onSearchSubmit} className="mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by name..."
        className="border rounded p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
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
