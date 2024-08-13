import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"; 
import ReportedSightings from "./ReportedSightings"; 

function WantedList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  const maxVisiblePages = 10;

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
    queryKey: ["wantedList", currentPage], 
    queryFn: fetchWantedList,
    keepPreviousData: true, 
  });

  useEffect(() => {
    if (data && data.total) {
      const totalResults = data.total;
      setTotalPages(Math.ceil(totalResults / 20));
    }
  }, [data]);

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  const handleDeleteReport = (index) => {
    const updatedReports = reports.filter((_, i) => i !== index);
    setReports(updatedReports);
    localStorage.setItem("wantedReports", JSON.stringify(updatedReports));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mx-auto px-24 py-4">
      <h1 className="text-3xl font-bold text-center mb-8">FBI Wanted List</h1>

      <SearchBar onSearchSubmit={handleSearchSubmit} />

      {reports.length > 0 && (
        <ReportedSightings
          reports={reports}
          onDeleteReport={handleDeleteReport}
        />
      )}

<div className=" min-h-screen p-6">
      {filteredItems.length > 0 ? (
        <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <li
              key={item.uid}
              className="bg-zinc-900 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-700"
            >
              <Link to={`/details/${item.uid}`} className="block">
                <h2 className="text-lg font-semibold text-white mb-4 hover:text-blue-500 transition-colors line-clamp-2">
                  {item.title}
                </h2>

                {item.images && item.images.length > 0 && (
                  <img
                    src={item.images[0].thumb || item.images[0].large}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-gray-300 line-clamp-3">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 py-6">
          No wanted persons found.
        </p>
      )}
    </div>

      {/* Pagination */}
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
