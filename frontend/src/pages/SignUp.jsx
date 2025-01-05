import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
 

const SignUp = () => {
  const [SignUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
    previewImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file); // Generate preview URL
      setSignUpInfo((prev) => ({
        ...prev,
        profileImage: file,
        previewImage: previewURL,
      }));
    }
  };

  const handleSignUp = async (e) => {
    const formData = new FormData();

    formData.append("name", SignUpInfo.name);
    formData.append("email", SignUpInfo.email);
    formData.append("password", SignUpInfo.password);
    formData.append("profileImage", SignUpInfo.profileImage);

    e.preventDefault();
    const { name, email, password } = SignUpInfo;
    if (!name || !email || !password) {
      return handleError("name, email, password are required");
    }

    try {
      const url = `${import.meta.env.VITE_API}/auth/signup`;
      const response = await fetch(url, {
        method: "POST",

        body: formData,
      });

      const result = await response.json();
      const { message, success, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="px-8 sm:px-16 lg:px-32 mb-10">
  <div className="flex flex-col">
    <div className="flex flex-col">
      <h2 className="text-black pt-8 text-3xl sm:text-4xl font-bold">
        Register Here
      </h2>
      <h3 className="pb-5 pt-1 text-lg sm:text-xl">
        Register to apply for new internships and also you can publish new internships
      </h3>
    </div>
    <div className="px-6 sm:px-12 pt-8 w-full sm:w-[70%] pb-5 rounded-2xl mt-5 shadow-[5px_5px_25px_-5px_rgba(0,0,0,.2)]">
      <form onSubmit={handleSignUp}>
        <p>Profile Picture</p>
        <div className="flex items-center gap-3">
          <label htmlFor="profileImage" className="text-xl">
            <img
              src={SignUpInfo.previewImage || "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png"}
              alt="Profile Preview"
              className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full my-5 shadow-[0_4px_10px_rgba(0,0,0,.3)] object-cover"
            />
          </label>
          <input
            style={{ display: "none" }}
            type="file"
            name="profileImage"
            id="profileImage"
            accept="image/*"
            onChange={handleProfileImage}
          />
        </div>

        <div>
          <label htmlFor="name">
            <h4 className="text-xl">Full name</h4>
          </label>
          <input
            className="text-xl mb-3 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={SignUpInfo.name}
          />
        </div>

        <div>
          <label htmlFor="email">
            <h4 className="text-xl">Email ID</h4>
          </label>
          <input
            className="text-xl mb-3 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email id"
            value={SignUpInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">
            <h4 className="text-xl">Password</h4>
          </label>
          <input
            className="text-xl mb-3 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="(Minimum 5 characters)"
            value={SignUpInfo.password}
          />
        </div>

        <button
          type="submit"
          className="text-[#FFFFFF] text-md font-bold rounded border-2 bg-purple-600 border-purple-600 w-full sm:w-1/2 py-2 my-3 px-2"
        >
          Register now
        </button>
        <p className="text-xl mt-2">
          <span>
            Already have an account?
            <Link to="/login" className="text-blue-600">
              {" "}
              Login
            </Link>
          </span>
        </p>
      </form>
    </div>
    <ToastContainer />
  </div>
</div>

  );
};

export default SignUp;
