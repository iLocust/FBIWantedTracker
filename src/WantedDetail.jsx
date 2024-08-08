import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

function WantedDetail() {
  const { uid } = useParams();

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
      <p className="text-gray-700 mb-2"><strong>Details:</strong> {data.details || 'N/A'}</p>
      <p className="text-gray-700"><strong>Warning Message:</strong> {data.warning_message || 'N/A'}</p>
    </div>
  );
}

export default WantedDetail;
