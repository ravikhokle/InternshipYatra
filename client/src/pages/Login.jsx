import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google";
import { handleError, handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const [LoginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const response = await axiosInstance.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      const { message, success, accessToken, name, userID, userProfile } = response.data;

      if (success) {
        handleSuccess(message);
        login({ accessToken, name, userID, userProfile });
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Google login failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

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
      {googleClientId ? (
        <div className="mb-5 flex justify-center">
          {googleLoading ? (
            <div className="w-full py-3 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-lg text-gray-500 text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Signing in with Google...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => handleError("Google login was cancelled or failed")}
              theme="outline"
              size="large"
              text="signin_with"
              width={420}
              shape="rectangular"
            />
          )}
        </div>
      ) : null}

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">or login with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

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
            className="text-xl mb-2 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password..."
            value={LoginInfo.password}
          />
          <p className="text-right mb-5">
            <Link to="/forgot-password" className="text-purple-600 text-base hover:underline">
              Forgot Password?
            </Link>
          </p>
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