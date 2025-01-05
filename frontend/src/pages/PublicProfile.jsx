import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleError } from "../Utils";
import { ToastContainer } from "react-toastify";
import axios from "axios";
 

const PublicProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  const fetchProfileData = async () => {
    try {
      const url = `${import.meta.env.VITE_API}/profile/publicProfile`;

      const response = await axios.get(url, {
        params: { _id: id },
      });

      setUserData(response.data);
    } catch (error) {
      handleError("An error occurred while fetching the user profile");
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (


<div className="px-8 flex justify-center items-center bg-gray-50 h-screen">
  <div className="bg-white p-8 mt-10 rounded-lg shadow-sm border border-gray-200 max-w-sm w-full">
    <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
      Public Profile
    </h1>
    <div className="flex justify-center mb-6">
      <img
        src={userData.profileImgURL || "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png"}
        alt="Profile Picture"
        className="w-[150px] h-[150px] rounded-full shadow-md object-cover border-4 border-gray-100"
      />
    </div>
    <div className="text-center">
      <h3 className="text-2xl font-medium text-gray-800 mb-2">
        {userData.name}
      </h3>
      <p className="text-gray-600 italic mb-4">
        "{userData.bio || "No bio available"}"
      </p>
    </div>
    <div className="text-center">
      <p className="text-gray-600">
        <span className="font-medium">City:</span> {userData.city || "Unknown"}
      </p>
    </div>
  </div>
</div>





  );
};

export default PublicProfile;
