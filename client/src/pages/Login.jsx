import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { handleError, handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const [LoginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = LoginInfo;
    if (!email || !password) {
      return handleError('email and password not valid');
    }

    try {
      const response = await axiosInstance.post('/auth/login', LoginInfo);
      const { message, success, accessToken, name, userID, userProfile, error } = response.data;

      if (success) {
        handleSuccess(message);
        login({ accessToken, name, userID, userProfile });
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="px-8 sm:px-16 lg:px-32 pb-16">
  <h2 className="text-black pt-8 text-3xl sm:text-4xl font-bold">Welcome Back!</h2>
  <h3 className="pb-8 pt-1 text-lg sm:text-xl">Login to your Account</h3>

  <div className="flex flex-col sm:flex-row w-full mt-5">
    <div className="w-full sm:w-1/2 pr-8 pb-8">
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">
            <h4 className="text-2xl">Email ID</h4>
          </label>
          <input
            className="text-xl mb-5 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email id"
            value={LoginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">
            <h4 className="text-2xl">Password</h4>
          </label>
          <input
            className="text-xl mb-5 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password..."
            value={LoginInfo.password}
          />
        </div>

        <button
          type="submit"
          className="text-[#FFFFFF] text-lg font-bold rounded border-2 bg-purple-600 border-purple-600 w-full py-3"
        >
          Login
        </button>
        <p className="text-xl text-center mt-3">
          <span>
            Don&apos;t have an account?
            <Link to="/signup" className="text-blue-600">
              {" "}
              Register
            </Link>
          </span>
        </p>
      </form>
    </div>

    <div className="w-full sm:w-1/2 mt-5 sm:mt-0">
      <img
        src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079379/frontend/bw0k9pjed2irxfm3kmh7.jpg"
        alt="team image"
        className="rounded-xl w-full h-auto"
      />
    </div>
  </div>
</div>
  )
}

export default Login