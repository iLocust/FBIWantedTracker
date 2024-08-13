import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mx-auto px-24 py-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-white-700 mb-4">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="text-blue-600 hover:underline text-lg font-semibold"
      >
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;
