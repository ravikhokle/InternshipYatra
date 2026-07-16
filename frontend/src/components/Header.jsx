import { Link, useNavigate } from "react-router-dom";
import { handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";

const HOME_ICON =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/sr8zpyswicaq7lyx8wbi.png";

const navLinkClass =
  "text-[#303030] text-sm lg:text-base hover:text-purple-600 transition-colors";

const Header = () => {
  const { auth, logout } = useAuth();
  const { accessToken, userProfile } = auth;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    handleSuccess("Logged out");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md">
      <div className="flex items-center justify-between gap-3 py-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1600px] mx-auto">
        <h1 className="text-purple-600 text-lg sm:text-xl lg:text-2xl font-semibold shrink-0">
          <Link to="/">InternshipYatra</Link>
        </h1>

        {/* Desktop / large tablet nav */}
        <ul className="hidden lg:flex flex-wrap items-center justify-center gap-6 xl:gap-10 flex-1 px-4">
          <li>
            <Link to="/" className="text-purple-600 text-sm lg:text-base hover:opacity-80">
              Home
            </Link>
          </li>
          {accessToken && (
            <li>
              <Link to="/profile" className={navLinkClass}>
                Profile
              </Link>
            </li>
          )}
          <li>
            <Link to="/createpost" className={navLinkClass}>
              Post
            </Link>
          </li>
          <li>
            <Link to="/contact" className={navLinkClass}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/about" className={navLinkClass}>
              About
            </Link>
          </li>
        </ul>

        {/* Mobile & tablet actions — old compact navbar */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link to="/" className="lg:hidden flex items-center" aria-label="Home">
            <img src={HOME_ICON} alt="" className="w-8 h-8 object-contain" />
          </Link>

          {accessToken ? (
            <>
              <Link to="/profile" className="lg:hidden flex items-center" aria-label="Profile">
                <img
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md object-cover border border-gray-100"
                  src={userProfile || DEFAULT_AVATAR}
                  alt="Profile"
                />
              </Link>
              <Link
                to="/profile"
                className="hidden lg:flex items-center mr-1"
                aria-label="Profile"
              >
                <img
                  className="rounded-full w-10 h-10 xl:w-11 xl:h-11 drop-shadow-lg object-cover border border-gray-100"
                  src={userProfile || DEFAULT_AVATAR}
                  alt="Profile"
                />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden lg:inline-flex text-white rounded-lg border-2 bg-purple-600 border-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="hidden sm:inline-flex text-purple-600 rounded-lg border-2 border-purple-600 px-3 py-1.5 sm:px-5 sm:py-2 text-sm font-medium hover:bg-purple-50 transition-colors"
              >
                SignUp
              </Link>
              <Link
                to="/login"
                className="text-white rounded-lg border-2 bg-purple-600 border-purple-600 px-3 py-1.5 sm:px-5 sm:py-2 text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
