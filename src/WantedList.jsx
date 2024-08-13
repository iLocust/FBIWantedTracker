import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"; // Import the SearchBar component

function WantedList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false); // State for dropdown visibility

  const maxVisiblePages = 10; // Maximum number of visible pages in the pagination bar

  useEffect(() => {
    const storedReports =
      JSON.parse(localStorage.getItem("wantedReports")) || [];
    setReports(storedReports);
  }, []);

  const fetchWantedList = async ({ queryKey }) => {
    const [, page] = queryKey;
    const response = await fetch(`https://api.fbi.gov/@wanted?page=${page}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["wantedList", currentPage], // Pass currentPage as part of the query key
    queryFn: fetchWantedList,
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  useEffect(() => {
    if (data && data.total) {
      // Set total pages based on total results from the API
      const totalResults = data.total;
      const resultsPerPage = 20; // Assuming each page contains 20 results
      setTotalPages(Math.ceil(totalResults / resultsPerPage));
    }
  }, [data]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleDeleteReport = (index) => {
    const updatedReports = reports.filter((_, i) => i !== index);
    setReports(updatedReports);
    localStorage.setItem("wantedReports", JSON.stringify(updatedReports));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDropdown = () => {
    setIsDropdownExpanded(!isDropdownExpanded);
  };

  const filteredItems =
    data?.items?.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to fetch data</p>;
  }

  // Calculate visible page numbers
  const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mx-auto px-24 py-4">
      <h1 className="text-3xl font-bold text-center mb-8">FBI Wanted List</h1>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {reports.length > 0 && (
        <div className="mb-8 bg-gray-100 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Reported Sightings
            </h2>
            <button
              onClick={toggleDropdown}
              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-white-400 rounded transition duration-200"
            >
              {isDropdownExpanded ? "Hide" : "Show"}
            </button>
          </div>
          {isDropdownExpanded && reports.length > 0 && (
            <ul className="mt-4 space-y-4">
              {reports.map((report, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-black shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center">
                    {report.image && (
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-16 h-16 object-cover rounded-full mr-4"
                      />
                    )}
                    <div className="text-white-700">
                      <p className="font-semibold">{report.title}</p>
                      <p className="text-sm">{report.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReport(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full transition-colors duration-200"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filteredItems.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <li
              key={item.uid}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow border border-gray-200"
            >
              <Link to={`/details/${item.uid}`} className="block">
                <h2 className="text-xl font-semibold text-blue-600 mb-3 hover:text-blue-800 transition-colors line-clamp-2">
                  {item.title}
                </h2>

                {item.images && item.images.length > 0 && (
                  <img
                    src={item.images[0].thumb || item.images[0].large}
                    alt={item.title}
                    className="w-full h-48 object-fill rounded-md mb-4"
                  />
                )}
                <p className="text-gray-600 line-clamp-3">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-700 py-6">
          No wanted persons found.
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-500 transition"
          >
            First
          </button>
        )}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-500 transition"
          >
            Previous
          </button>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-1 ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-md hover:bg-blue-500 transition`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-500 transition"
          >
            Next
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-500 transition"
          >
            Last
          </button>
        )}
      </div>
    </div>
  );
}

export default WantedList;
