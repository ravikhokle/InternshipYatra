import { useEffect, useState } from "react";
import { handleError, handleSuccess} from "../Utils";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import profilePlaceHolder from "../assets/Images/profilePlaceHolder.png";
import companyPlaceHolder from '../assets/Images/companyPlaceHolder.png';
import editIcon from "../assets/Images/editImage.png";
import resumeIcon from "../assets/Images/resume.png";
import { useNavigate } from "react-router-dom";
 

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImgURL: "",
    resumeURL: "",
    bio: "",
    city: "",
    number: "",
    companyLogoURL: "",
    companyName: "",
    companyBio: "",
  });

  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const userID = localStorage.getItem("userID");
      const url = `${import.meta.env.VITE_API}/profile?_id=${userID}`;

      const response = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const result = await response.json();
      setProfile(result);
    } catch (error) {
      handleError(error);
      toast.error("An error occurred while fetching the profile data.");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("LogedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("userProfile");
    handleSuccess("Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="px-5 md:px-16 lg:px-32 py-10 flex flex-col gap-8 bg-gray-50 min-h-screen">
      <div className="p-5 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold pb-3 mb-5">User Profile</h1>
        <div className="flex flex-row justify-center sm:justify-normal">
          <img
            src={profile.profileImgURL || profilePlaceHolder}
            alt="Profile Picture"
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full shadow-lg object-cover"
          />
          <Link to="/updateprofileimage">
            <img src={editIcon} alt="Edit icon" className="w-4 h-4 cursor-pointer" />
          </Link>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <p className="text-lg md:text-xl font-medium">Name: {profile.name}</p>
            <Link to="/updateuserprofile">
              <img src={editIcon} alt="Edit icon" className="w-4 h-4 cursor-pointer" />
            </Link>
          </div>
          <p>Email: <span className="text-gray-600">{profile.email}</span></p>
          <p>Bio: <span className="text-gray-600">{profile.bio}</span></p>
          <p>City: <span className="text-gray-600">{profile.city}</span></p>
          <p>Number: <span className="text-gray-600">{profile.number}</span></p>
          <div className="flex items-center gap-3">
            <Link
              to={profile.resumeURL}
              target="_blank"
              className="text-blue-500 font-medium hover:underline flex items-center gap-2"
            >
              Resume
              <img className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" src={resumeIcon} alt="Resume Icon" />
            </Link>
            <Link to="/updateresume">
              <img src={editIcon} alt="Edit icon" className="w-4 h-4 cursor-pointer" />
            </Link>
          </div>
          <button onClick={handleLogout} className="md:hidden">
           Logout
           </button>
        </div>
      </div>

      <hr className="my-4 border-2 border-purple-600" />

      <div className="p-5 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold pb-3 mb-5">For Company/Organizations</h2>
        <div className="flex flex-row justify-center sm:justify-normal">
          <img
            src={profile.companyLogoURL || companyPlaceHolder}
            alt="Company Logo"
            className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full shadow-lg object-cover"
          />
          <Link to="/updatecompanylogo">
            <img src={editIcon} alt="Edit icon" className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <p className="text-lg md:text-xl font-medium">Name: {profile.companyName}</p>
          <p>
            Bio: <span className="text-gray-600">{profile.companyBio}</span>
          </p>
          <Link
            to="/CreatePost"
            className="text-blue-500 font-medium hover:underline"
          >
            Post Internship
          </Link>
          <Link
            to="/userposts"
            className="text-blue-500 font-medium hover:underline"
          >
            View your posts
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserProfile;
  
