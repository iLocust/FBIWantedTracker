import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

function WantedDetail() {
  const { uid } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');

  const fetchWantedDetail = async () => {
    const response = await fetch(`https://api.fbi.gov/@wanted-person/${uid}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['wantedDetail', uid],
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
    setDescription('');
  };

  const handleReportSubmit = () => {
    const reports = JSON.parse(localStorage.getItem('wantedReports')) || [];
    reports.push({ uid, description });
    localStorage.setItem('wantedReports', JSON.stringify(reports));
    handleModalClose();
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to fetch details</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">Back to List</Link>
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      {data.images && data.images.length > 0 && (
        <img
          src={data.images[0].large}
          alt={data.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}
      <p className="text-gray-700 mb-4">{data.description}</p>
      <p className="text-gray-700 mb-2"><strong>Reward:</strong> {data.reward_text || 'N/A'}</p>
      <p className="text-gray-700 mb-2"><strong>Details:</strong> {stripHtml(data.details) || 'N/A'}</p>
      <p className="text-gray-700"><strong>Warning Message:</strong> {data.warning_message || 'N/A'}</p>

      <button 
        onClick={handleReport} 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Have you seen this person?
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Report Sighting</h2>
            <p className="mb-2">Have you seen this person?</p>
            <textarea
              className="w-full p-2 border rounded-md mb-4"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter any additional information here..."
            />
            <div className="flex justify-end">
              <button 
                onClick={handleModalClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                No
              </button>
              <button 
                onClick={handleReportSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WantedDetail;
