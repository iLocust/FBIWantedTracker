import { useState } from "react";
import PropTypes from "prop-types";

function ReportedSightings({ reports, onDeleteReport }) {
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false); 

  const toggleDropdown = () => {
    setIsDropdownExpanded(!isDropdownExpanded);
  };

  return (
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
                onClick={() => onDeleteReport(index)}
                className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full transition-colors duration-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ReportedSightings.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  onDeleteReport: PropTypes.func.isRequired,
};

export default ReportedSightings;
