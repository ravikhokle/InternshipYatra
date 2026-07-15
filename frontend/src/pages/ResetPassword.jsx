import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import {
  CenteredAuthPage,
  AuthCard,
  authInputClass,
  authButtonClass,
} from "../components/AuthLayout";

const ResetPassword = () => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken || "";

  useEffect(() => {
    if (!resetToken) navigate("/forgot-password");
  }, [resetToken, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getStrength = (password) => {
    if (!password) return { label: "", color: "", width: "0%" };
    if (password.length < 5) return { label: "Too short", color: "bg-red-400", width: "25%" };
    if (password.length < 8) return { label: "Weak", color: "bg-orange-400", width: "50%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: "Fair", color: "bg-yellow-400", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.newPassword || !form.confirmPassword) return handleError("Both fields are required");
    if (form.newPassword.length < 5) return handleError("Password must be at least 5 characters");
    if (form.newPassword !== form.confirmPassword) return handleError("Passwords do not match");

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        resetToken,
        newPassword: form.newPassword,
      });

      if (response.data.success) {
        handleSuccess("Password reset successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredAuthPage>
      <AuthCard>
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-1">
          Set New Password
        </h1>
        <p className="text-gray-500 text-center text-xs sm:text-sm mb-6 sm:mb-8 px-2">
          Create a strong password you haven&apos;t used before.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative mb-2">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Min. 5 characters"
              className={`${authInputClass} pr-10`}
              autoFocus
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

          {form.newPassword && (
            <div className="mb-4">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
            </div>
          )}

          <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative mb-5 sm:mb-6">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`${authInputClass} ${
                form.confirmPassword && form.newPassword !== form.confirmPassword
                  ? "border-red-400 focus:border-red-400"
                  : ""
              }`}
            />
            {form.confirmPassword && form.newPassword === form.confirmPassword && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Resetting...
              </span>
            ) : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            ← Back to Login
          </Link>
        </p>
      </AuthCard>
    </CenteredAuthPage>
  );
};

export default ResetPassword;
