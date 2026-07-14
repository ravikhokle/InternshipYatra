import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { CenteredAuthPage, AuthCard, authInputClass, authButtonClass } from "../components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return handleError("Please enter your email address");

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      if (response.data.success) {
        handleSuccess("OTP sent! Check your inbox.");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 1200);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredAuthPage>
      <AuthCard>
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-1">
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-center text-xs sm:text-sm mb-6 sm:mb-8 px-2">
          Enter your registered email and we&apos;ll send you a 6-digit OTP.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`${authInputClass} mb-4 sm:mb-5`}
            autoFocus
          />

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending OTP...
              </span>
            ) : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </AuthCard>
    </CenteredAuthPage>
  );
};

export default ForgotPassword;
