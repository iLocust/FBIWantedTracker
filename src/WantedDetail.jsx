import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

function WantedDetail() {
  const { uid } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");

  const fetchWantedDetail = async () => {
    const response = await fetch(`https://api.fbi.gov/@wanted-person/${uid}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["wantedDetail", uid],
    queryFn: fetchWantedDetail,
  });

  const handleReport = () => {
    setShowModal(true);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setDescription("");
  };

  const handleReportSubmit = () => {
    const reports = JSON.parse(localStorage.getItem("wantedReports")) || [];
    reports.push({
      uid,
      title: data.title,
      image: data.images?.[0]?.thumb || "",
      description,
    });
    localStorage.setItem("wantedReports", JSON.stringify(reports));
    handleModalClose();
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to fetch details</p>;
  }

  return (
    <div className="mx-auto px-24 py-4">
      <h1 className="text-3xl font-bold text-center mb-8">FBI Wanted List</h1>
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        Back to List
      </Link>
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div className="flex flex-col md:flex-row items-start mb-6">
        {data.images && data.images.length > 0 && (
          <img
            src={data.images[0].thumb}
            alt={data.title}
            className="size-fit md:w-1/2object-contain rounded-md mb-6 md:mb-0 md:mr-6"
          />
        )}
        <div className="flex-1">
          <p className="text-white-700 mb-4">{stripHtml(data.description)}</p>
          <p className="text-white-700 mb-2">
            <strong>Details:</strong> {stripHtml(data.details) || "N/A"}
          </p>
          <p className="text-white-700 mb-2">
            <strong>Reward:</strong> {data.reward_text || "N/A"}
          </p>
          <p className="text-white-700 mb-2">
            <strong>Age:</strong> {data.age_range || "N/A"}
          </p>
          <p className="text-white-700 mb-2">
            <strong>Race:</strong> {data.race || "N/A"}
          </p>
          <p className="text-white-700 mb-2">
            <strong>Publication Date:</strong>{" "}
            {new Date(data.publication).toLocaleDateString() || "N/A"}
          </p>
          <p className="text-white-700 mb-2">
            <strong>Subjects:</strong> {data.subjects?.join(", ") || "N/A"}
          </p>
          <p className="text-white-700 mb-2">
            <strong>Appearance:</strong>
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Hair Color:</strong> {data.hair || "N/A"}
            </li>
            <li>
              <strong>Eye Color:</strong> {data.eyes || "N/A"}
            </li>
            <li>
              <strong>Height:</strong> {data.height_min || "N/A"} inches
            </li>
            <li>
              <strong>Weight:</strong> {data.weight_min || "N/A"} pounds
            </li>
          </ul>
          <p className="text-white-700 mb-2">
            <strong>Scars and Marks:</strong> {stripHtml(data.remarks) || "N/A"}
          </p>
          <p className="text-white-700">
            <strong>Warning Message:</strong> {data.warning_message || "N/A"}
          </p>
          <button
            onClick={handleReport}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Have you seen this person?
          </button>
          {data.files && data.files.length > 0 && (
            <a
              href={data.files[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-5 mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition inline-block"
            >
              Download File
            </a>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Report Sighting
            </h2>
            <p className="text-gray-600 mb-4">Have you seen this person?</p>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 resize-none"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter any additional information here..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WantedDetail;
