import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import GoogleAuthButton from "../components/GoogleAuthButton";
import {
  AuthPageShell,
  AuthCard,
  AuthDivider,
  authInputClass,
  authButtonClass,
} from "../components/AuthLayout";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

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
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", loginInfo);
      const { message, success, accessToken, name, userID, userProfile, error } = response.data;

      if (success) {
        handleSuccess(message);
        login({ accessToken, name, userID, userProfile });
        setTimeout(() => navigate("/profile"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Invalid login details");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      heroTitle="Welcome back!"
      heroDescription="Log in to apply for internships, manage your profile, and connect with opportunities."
    >
      <AuthCard>
        <div className="flex justify-center mb-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Login</h1>
        <p className="text-gray-500 text-center text-xs sm:text-sm mb-5">
          Welcome back — sign in to continue
        </p>

        {googleClientId && (
          <GoogleAuthButton
            text="signin_with"
            label="Sign in with Google"
            onSuccess={handleGoogleSuccess}
            onError={() => handleError("Google login was cancelled or failed")}
            loading={googleLoading}
            loadingText="Signing in with Google..."
          />
        )}

        {googleClientId && <AuthDivider text="or login with email" />}

        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={loginInfo.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`${authInputClass} mb-4`}
          />

          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative mb-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={loginInfo.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`${authInputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <p className="text-right mb-4 sm:mb-5">
            <Link to="/forgot-password" className="text-purple-600 text-xs sm:text-sm hover:underline">
              Forgot Password?
            </Link>
          </p>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </AuthCard>
    </AuthPageShell>
  );
};

export default Login;
