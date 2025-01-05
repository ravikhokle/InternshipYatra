import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
 
const UpdateCompanyLogo = () => {
  const [user, updateUser] = useState({
    companyLogo: null,
    previewCompanyLogo: null,
  });

  const navigate = useNavigate();

  const handleCompanyLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      updateUser((prev) => ({
        ...prev,
        companyLogo: file,
        previewCompanyLogo: previewURL,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const Data = new FormData();
    Data.append("companyLogo", user.companyLogo);
  
    const id = localStorage.getItem("userID");
  
    const url = `${import.meta.env.VITE_API}/profile/updateCompanyLogo`;
  
    try {
      const result = await axios.put(url, Data, {
        params: { _id: id },
      });

      const { message, success } = result.data;

      if (success) {
        handleSuccess(message);
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
    <div className="flex flex-col items-center md:items-start gap-2">
      <div className="flex flex-col items-center md:items-start">
        <label htmlFor="companyLogo" className="cursor-pointer">
          <img
            src={user.previewCompanyLogo || "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png"}
            alt="Preview Company Logo"
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full my-5 shadow-[0_4px_10px_rgba(0,0,0,.3)] object-cover"
          />
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          name="companyLogo"
          id="companyLogo"
          accept="image/*"
          onChange={handleCompanyLogo}
        />
      </div>
      <input
        type="submit"
        value="Upload"
        className="w-[80px] md:w-[100px] px-5 py-2 bg-[#6300B3] rounded-md text-white mt-4 md:mt-0"
      />
    </div>
  </form>
  <ToastContainer />
</div>
  
  );
};

export default UpdateCompanyLogo;
