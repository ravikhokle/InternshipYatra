import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { handleError, handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      handleError(err.response?.data?.message || "Google sign-up failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }
    if (password.length < 5) {
      return handleError("Password must be at least 5 characters");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const { message, success, error } = response.data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Invalid signup details");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-white to-[#ede9fe] flex items-center py-10 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-12 items-center">

          {/* Left — image + copy */}
          <div className="flex flex-col gap-8 lg:gap-10">
            <img
              src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079379/frontend/bw0k9pjed2irxfm3kmh7.jpg"
              alt="Join InternshipYatra"
              className="w-full h-auto max-h-[420px] lg:max-h-[480px] object-contain mx-auto"
            />

            <div className="text-center lg:text-left px-1 sm:px-2">
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">
                InternshipYatra
              </p>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Start your journey today
              </h2>
              <p className="text-base sm:text-lg xl:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Apply for internships, connect with companies, and publish opportunities — all in one place.
              </p>
            </div>
          </div>

          {/* Right — signup form */}
          <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(124,58,237,0.12)] p-6 sm:p-8">

            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Create Account</h1>
            <p className="text-gray-500 text-center text-xs sm:text-sm mb-5">
              Join in under a minute
            </p>

            {googleClientId ? (
              <div className="mb-4 flex justify-center">
                {googleLoading ? (
                  <div className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-lg text-gray-500 text-xs">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing up with Google...
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => handleError("Google sign-up was cancelled or failed")}
                    theme="outline"
                    size="large"
                    text="signup_with"
                    width={420}
                    shape="rectangular"
                  />
                )}
              </div>
            ) : (
              <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs text-center">
                Google sign-up requires VITE_GOOGLE_CLIENT_ID in client/.env
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">or email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSignUp}>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors text-sm mb-3"
              />

              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors text-sm mb-3"
              />

              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative mb-4">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 5 characters"
                  className="w-full px-3 py-2.5 pr-10 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
