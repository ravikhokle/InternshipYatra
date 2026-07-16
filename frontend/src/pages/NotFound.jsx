import { Link } from "react-router-dom";
import { AppIcons, BackLink } from "../components/AppIcons";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex flex-col items-center justify-center gap-4 px-4">
      <AppIcons.Alert className="w-16 h-16 text-purple-300" />
      <h1 className="text-2xl font-bold text-gray-900">404 — Page Not Found</h1>
      <p className="text-gray-500 text-sm text-center max-w-md">
        The page you are looking for does not exist or may have been moved.
      </p>
      <BackLink to="/">Back to Home</BackLink>
      <Link to="/" className="text-sm text-purple-600 hover:underline">
        Explore internships
      </Link>
    </div>
  );
};

export default NotFound;
