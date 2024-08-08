import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function WantedList() {
  const fetchWantedList = async () => {
    const response = await fetch('https://api.fbi.gov/@wanted');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['wantedList'],
    queryFn: fetchWantedList,
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to fetch data</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">FBI Wanted List</h1>
      {data.items.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2">
          {data.items.map((item) => (
            <li key={item.uid} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <Link to={`/details/${item.uid}`} className="block">
                <h2 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h2>
                {item.images && item.images.length > 0 && (
                  <img
                    src={item.images[0].thumb}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <p className="text-gray-700">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-700">No wanted persons found.</p>
      )}
    </div>
  );
}

export default WantedList;
