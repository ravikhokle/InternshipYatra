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
      <h1 className="text-purple-600 text-xl md:text-2xl sm:xl">
        <Link to="/">InternshipYatra</Link>
      </h1>
      <ul className="sm:flex flex-wrap gap-4 md:gap-10 items-center hidden">
        <li>
          <Link to="/" className="text-purple-600 text-sm md:text-base">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-[#303030] text-sm md:text-base">
            About
          </Link>
        </li>
        <li>
          <Link to="/createpost" className="text-[#303030] text-sm md:text-base">
            Post
          </Link>
        </li>
      </ul>
      <div className="flex items-center">
        {accessToken ? (
          <div className="flex flex-row gap-6 items-center">
            <Link to="/" className="sm:hidden w-8">
              <img
                src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/sr8zpyswicaq7lyx8wbi.png"
                alt="Home Icon"
              />
            </Link>
            <Link to="/profile" className="sm:mr-3 md:mr-5 flex items-center">
              <img
                className="rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] drop-shadow-lg"
                src={userProfile}
                alt="Profile"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="text-white rounded border-2 bg-purple-600 border-purple-600 px-3 py-1 md:px-5 md:py-2 hidden md:flex lg:flex"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-6 items-center">
            <Link to="/" className="sm:hidden">
              <img
                className="w-8 h-8 mr-4"
                src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/sr8zpyswicaq7lyx8wbi.png"
                alt="Home Icon"
              />
            </Link>
            <Link
              to="/signup"
              className="text-purple-600 rounded border-2 border-purple-600 px-4 py-2 md:px-8 md:py-3 mr-3 md:mr-5 hidden sm:flex"
            >
              SignUp
            </Link>
            <Link
              to="/login"
              className="text-white rounded border-2 bg-purple-600 border-purple-600 px-4 py-2 md:px-8 md:py-3"
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
