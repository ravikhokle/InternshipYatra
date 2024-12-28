import { useState } from "react";
import axios from "axios";
import profilePlaceHolder from "../assets/Images/profilePlaceHolder.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
 

const UpdateProfileImg = () => {
  const [user, updateUser] = useState({
    profileImage: null,
    previewProfileImage: null,
  });

  const navigate = useNavigate();

  const handleprofileImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      updateUser((prev) => ({
        ...prev,
        profileImage: file,
        previewProfileImage: previewURL,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Data = new FormData();
    Data.append("profileImage", user.profileImage);

    const id = localStorage.getItem("userID");

    const url = `${import.meta.env.VITE_API}/profile/updateProfileImg`;

    try {
      const response = await axios.put(url, Data, {
        params: { _id: id },
      });

      const { message, success, userProfile } = response.data;

      if (success) {
              handleSuccess(message);
              localStorage.setItem('userProfile', userProfile);
              setTimeout(() => {
                navigate("/profile");
              }, 1000);
            }
    } catch (error) {
      handleError(error.response?.data || error.message);
    }
  };

  return (
    <div className="px-5 md:px-16 lg:px-32 py-10 flex flex-col gap-8 bg-gray-50 min-h-screen">
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col items-center md:items-start">
      <div className="flex flex-col items-center md:items-start">
        <label htmlFor="profileImage" className="cursor-pointer">
          <img
            src={user.previewProfileImage || profilePlaceHolder}
            alt="Profile Preview"
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full my-5 shadow-[0_4px_10px_rgba(0,0,0,.3)] object-cover"
          />
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          name="profileImage"
          id="profileImage"
          accept="image/*"
          onChange={handleprofileImg}
        />
      </div>
      <input
        type="submit"
        value="Upload"
        className="w-[100px] px-5 py-2 bg-[#6300B3] rounded-md text-white mt-4 md:mt-0"
      />
    </div>
  </form>
  <ToastContainer />
</div>

  );
};

export default UpdateProfileImg;
