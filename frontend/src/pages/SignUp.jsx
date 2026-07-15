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
import { validateSignupForm, getPasswordStrength } from "../utils/validation";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (touched[name] || (name === "password" && touched.confirmPassword)) {
        const validationErrors = validateSignupForm(updatedForm);
        setErrors((prevErrors) => ({ ...prevErrors, ...validationErrors }));
      }
      return updatedForm;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validateSignupForm(form);
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
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

    const validationErrors = validateSignupForm(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.values(validationErrors).some((msg) => msg)) {
      return handleError("Please fix the errors before continuing");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/send-signup-otp", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (response.data.success) {
        handleSuccess("OTP sent! Check your email.");
        setTimeout(() => {
          navigate("/verify-signup-otp", {
            state: { email: form.email.trim(), name: form.name.trim() },
          });
        }, 1000);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `${authInputClass} ${
      errors[field] && touched[field]
        ? "border-red-400 focus:border-red-400"
        : ""
    }`;

  return (
    <AuthPageShell
      heroTitle="Start your journey today"
      heroDescription="Apply for internships, connect with companies, and publish opportunities — all in one place."
    >
      <AuthCard>
        <div className="flex justify-center mb-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-1">Create Account</h1>
        <p className="text-gray-500 text-center text-xs sm:text-sm mb-5">
          Verify your email to complete registration
        </p>

        {googleClientId ? (
          <GoogleAuthButton
            text="signup_with"
            label="Sign up with Google"
            onSuccess={handleGoogleSuccess}
            onError={() => handleError("Google sign-up was cancelled or failed")}
            loading={googleLoading}
            loadingText="Signing up with Google..."
          />
        ) : (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs text-center">
            Google sign-up requires VITE_GOOGLE_CLIENT_ID in client/.env
          </div>
        )}

        <AuthDivider text="or sign up with email" />

        <form onSubmit={handleSignUp} noValidate>
          <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className={`${inputClass("name")} mb-1`}
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-xs mb-3">{errors.name}</p>
          )}
          {!errors.name && <div className="mb-3" />}

          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            className={`${inputClass("email")} mb-1`}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mb-3">{errors.email}</p>
          )}
          {!errors.email && <div className="mb-3" />}

          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative mb-1">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min. 8 chars, upper, lower & number"
              className={`${inputClass("password")} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {form.password && (
            <div className="mb-1">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
            </div>
          )}
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mb-3">{errors.password}</p>
          )}
          {!errors.password && <div className="mb-3" />}

          <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative mb-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              className={`${inputClass("confirmPassword")} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showConfirmPassword ? (
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
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-red-500 text-xs mb-4">{errors.confirmPassword}</p>
          )}
          {!errors.confirmPassword && <div className="mb-4" />}

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending OTP...
              </span>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthPageShell>
  );
};

export default SignUp;
