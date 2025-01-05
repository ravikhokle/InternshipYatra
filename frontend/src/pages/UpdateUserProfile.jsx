import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
 

const UpdateUserProfile = () => {
  const [user, updateUser] = useState({
    name: "",
    email: "",
    bio: "",
    city: "",
    number: "",
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
      updateUser(result);
    } catch (error) {
      handleError(error);
      toast.error("An error while fetching profile data");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Data = new FormData();
    Data.append("name", user.name);
    Data.append("email", user.email);
    Data.append("bio", user.bio);
    Data.append("city", user.city);
    Data.append("number", user.number);
    Data.append("companyName", user.companyName);
    Data.append("companyBio", user.companyBio);

    const url = `${import.meta.env.VITE_API}/profile/updateProfile`;
    const id = localStorage.getItem("userID");

    try {
      const result = await axios.put(url, Data, {
        params: { _id: id },
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      const { message, success } = result.data;
  
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(
        "Name & Email is Required",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="px-5 md:px-16 lg:px-32 flex flex-col items-center pb-10 bg-gray-100">
      <div className="mt-5 text-center">
        <h2 className="text-2xl md:text-3xl font-[600]">
          Edit your profile details
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full md:w-[75%] lg:w-[50%]">
        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="name">
            Name:
          </label>
          <input
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            placeholder="enter your name"
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={user.name}
          />
        </div>

        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="email">
            Email:
          </label>
          <input
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            placeholder="enter your email"
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={user.email}
          />
        </div>

        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="bio">
            Bio:
          </label>
          <textarea
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            placeholder="enter your bio"
            name="bio"
            id="bio"
            onChange={handleChange}
            value={user.bio}
            rows="4"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="city">
            City:
          </label>
          <input
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            placeholder="Delhi, India"
            type="text"
            name="city"
            id="city"
            onChange={handleChange}
            value={user.city}
          />
        </div>

        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="number">
            Number:
          </label>
          <input
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            placeholder="+91 7218******"
            type="text"
            name="number"
            id="number"
            onChange={handleChange}
            value={user.number}
          />
        </div>

        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="companyName">
            Company Name:
          </label>
          <input
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            placeholder="optional"
            type="text"
            name="companyName"
            id="companyName"
            onChange={handleChange}
            value={user.companyName}
          />
        </div>

        <div className="flex flex-col">
          <label className="py-3 font-bold" htmlFor="companyBio">
            Company Bio:
          </label>

          <textarea
            className="py-4 px-5 border-[#E7E7F1] bg-white border-2 outline-none"
            laceholder="company bio (optional)"
            value={user.companyBio}
            onChange={handleChange}
            id="companyBio"
            name="companyBio"
            rows="4"
          ></textarea>
        </div>

        <div className="mt-5 flex justify-center">
          <input
            type="submit"
            value="Update"
            className="text-[#FFFFFF] text-lg rounded border-2 bg-[#6300B3] border-[#6300B3] w-1/2 md:w-1/3 py-3"
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateUserProfile;
