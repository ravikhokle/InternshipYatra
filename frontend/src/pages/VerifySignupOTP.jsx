import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import {
  CenteredAuthPage,
  AuthCard,
  authButtonClass,
  OtpInputClass,
} from "../components/AuthLayout";

const VerifySignupOTP = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const name = location.state?.name || "";

  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
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
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) return handleError("Please enter the complete 6-digit OTP");

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-signup-otp", { email, otp });
      if (response.data.success) {
        handleSuccess("Account created successfully!");
        setTimeout(() => navigate("/login"), 1200);
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
      const response = await axiosInstance.post("/auth/resend-signup-otp", { email });
      if (response.data.success) {
        handleSuccess("New OTP sent to your email!");
        setCountdown(60);
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Failed to resend OTP. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <CenteredAuthPage>
      <AuthCard>
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-1">
          Verify your email
        </h1>
        <p className="text-gray-500 text-center text-xs sm:text-sm mb-1 px-2">
          {name ? `Almost there, ${name}!` : "Almost there!"} Enter the 6-digit code sent to
        </p>
        <p className="text-purple-600 font-semibold text-center text-xs sm:text-sm mb-6 sm:mb-8 truncate px-2">
          {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="flex justify-between sm:justify-center gap-1.5 sm:gap-2 md:gap-3 mb-5 sm:mb-6 max-w-xs sm:max-w-none mx-auto"
            onPaste={handlePaste}
          >
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
                className={OtpInputClass(digit)}
              />
            ))}
          </div>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verifying...
              </span>
            ) : "Verify & Create Account"}
          </button>
        </form>

        <div className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-gray-500">
          Didn&apos;t receive it?{" "}
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

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          <Link to="/signup" className="text-purple-600 font-medium hover:underline">
            ← Back to signup
          </Link>
        </p>
      </AuthCard>
    </CenteredAuthPage>
  );
};

export default VerifySignupOTP;
