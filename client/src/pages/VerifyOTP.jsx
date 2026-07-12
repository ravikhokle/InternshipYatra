import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";

const VerifyOTP = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // resend cooldown
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // Redirect if no email was passed
  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    // Only allow single digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace → clear current and move to previous
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setDigits(newDigits);
    // Focus the last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) return handleError("Please enter the complete 6-digit OTP");

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      if (response.data.success) {
        handleSuccess("OTP verified!");
        setTimeout(() => {
          navigate("/reset-password", { state: { resetToken: response.data.resetToken } });
        }, 800);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      handleSuccess("New OTP sent to your email!");
      setCountdown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      handleError("Failed to resend OTP. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-white to-[#ede9fe] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(124,58,237,0.12)] p-8 sm:p-10">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-1">Check your email</h1>
        <p className="text-gray-500 text-center text-sm mb-2">
          We sent a 6-digit OTP to
        </p>
        <p className="text-purple-600 font-semibold text-center text-sm mb-8 truncate">{email}</p>

        <form onSubmit={handleSubmit}>
          {/* OTP digit inputs */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
                className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all
                  ${digit ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-800"}
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-100`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verifying...
              </span>
            ) : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-5 text-sm text-gray-500">
          Didn't receive it?{" "}
          {countdown > 0 ? (
            <span className="text-gray-400">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-purple-600 font-medium hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/forgot-password" className="text-purple-600 font-medium hover:underline">
            ← Use a different email
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
