import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { auth, logout } = useAuth();
  const { accessToken, userProfile } = auth;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    handleSuccess("Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <header className="flex flex-wrap justify-between items-center content-center py-4 px-5 sm:px-9 md:px-10 lg:px-32 bg-white shadow-md">
      <h1 className="text-purple-600 text-xl md:text-2xl font-semibold">
        <Link to="/">InternshipYatra</Link>
      </h1>

      <ul className="sm:flex flex-wrap gap-4 md:gap-10 items-center hidden">
        <li>
          <Link to="/" className="text-purple-600 text-sm md:text-base hover:opacity-80">
            Home
          </Link>
        </li>
        {accessToken && (
          <li>
            <Link to="/profile" className="text-[#303030] text-sm md:text-base hover:text-purple-600 transition-colors">
              Profile
            </Link>
          </li>
        )}
        <li>
          <Link to="/createpost" className="text-[#303030] text-sm md:text-base hover:text-purple-600 transition-colors">
            Post
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-[#303030] text-sm md:text-base hover:text-purple-600 transition-colors">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-[#303030] text-sm md:text-base hover:text-purple-600 transition-colors">
            About
          </Link>
        </li>
      </ul>

      <div className="flex items-center">
        {accessToken ? (
          <div className="flex flex-row gap-4 sm:gap-6 items-center">
            <Link to="/" className="sm:hidden text-purple-600 text-sm font-medium">
              Home
            </Link>
            <Link to="/profile" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              Profile
            </Link>
            <Link to="/createpost" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              Post
            </Link>
            <Link to="/contact" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              Contact
            </Link>
            <Link to="/about" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link to="/profile" className="sm:mr-3 md:mr-5 flex items-center">
              <img
                className="rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] drop-shadow-lg object-cover"
                src={userProfile}
                alt="Profile"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="text-white rounded border-2 bg-purple-600 border-purple-600 px-3 py-1 md:px-5 md:py-2 hidden md:flex lg:flex text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-4 sm:gap-6 items-center">
            <Link to="/" className="sm:hidden text-purple-600 text-sm font-medium">
              Home
            </Link>
            <Link to="/createpost" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              Post
            </Link>
            <Link to="/contact" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              Contact
            </Link>
            <Link to="/about" className="sm:hidden text-[#303030] text-sm font-medium hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link
              to="/signup"
              className="text-purple-600 rounded border-2 border-purple-600 px-4 py-2 md:px-8 md:py-3 text-sm font-medium hover:bg-purple-50 transition-colors hidden sm:flex"
            >
              SignUp
            </Link>
            <Link
              to="/login"
              className="text-white rounded border-2 bg-purple-600 border-purple-600 px-4 py-2 md:px-8 md:py-3 text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Login
            </Link>
          </div>
        )}
        <ToastContainer />
      </div>
    </header>
  );
};

export default Header;
