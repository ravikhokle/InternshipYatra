import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
import { useNavigate } from "react-router-dom";
 

const UpdateResume = () => {
  const [user, updateUser] = useState({
    resume: null,
    previewResume: null,
  });

  const navigate = useNavigate();

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.ms-excel")) {
      const previewURL = URL.createObjectURL(file);
      updateUser((prev) => ({
        ...prev,
        resume: file,
        previewResume: previewURL,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const Data = new FormData();
    Data.append("resume", user.resume);
  
    const id = localStorage.getItem("userID");
  
    const url = `${import.meta.env.VITE_API}/profile/updateResume`;
  
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
      handleError(handleError(error.response?.data || error.message));
    }
  };
  

  return (

 <div className="px-4 sm:px-10 md:px-16 lg:px-32 py-10 flex flex-col gap-8 bg-gray-50 min-h-screen">
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label htmlFor="resume" className="text-xl">
          {user.previewResume ? (
            <Link to={user.previewResume} target="_blank">
              View Resume{" "}
              <img
                src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079371/frontend/ivw2oggiei4fzzifq9bz.png"
                alt="Resume Icon"
                className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] my-5 shadow-[0_4px_10px_rgba(0,0,0,.3)] object-cover rounded-lg"
              />
            </Link>
          ) : (
            <img
              src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079371/frontend/ivw2oggiei4fzzifq9bz.png"
              alt="Resume Icon"
              className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] my-5 shadow-[0_4px_10px_rgba(0,0,0,.3)] object-cover rounded-lg"
            />
          )}
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          name="resume"
          id="resume"
          accept="application/pdf, application/vnd.ms-excel"
          onChange={handleResume}
        />
      </div>

      <input
        type="submit"
        value="Upload"
        className="w-1/3 mx-auto sm:w-[70px] sm:mx-0 sm:px-2 px-3 py-2 text-sm sm:text-base bg-[#6300B3] rounded-md text-white mt-3 sm:mt-0 "
      />
    </div>
  </form>
  <ToastContainer />
</div>


  );
};

export default UpdateResume;
