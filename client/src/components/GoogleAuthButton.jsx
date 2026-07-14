import { useRef, useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const GOOGLE_BTN_MAX = 400;

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GoogleAuthButton = ({
  text = "signin_with",
  label = "Continue with Google",
  onSuccess,
  onError,
  loading = false,
  loadingText = "Connecting with Google...",
}) => {
  const btnRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(0);

  useEffect(() => {
    if (!btnRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setBtnWidth(width);
    });
    observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-11 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-lg text-gray-500 text-sm">
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {loadingText}
      </div>
    );
  }

  return (
    <div ref={btnRef} className="relative w-full h-11">
      <div className="w-full h-full flex items-center justify-center gap-2 sm:gap-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium pointer-events-none px-3">
        <GoogleIcon />
        <span className="truncate">{label}</span>
      </div>
      {btnWidth > 0 && (
        <div className="absolute inset-0 overflow-hidden opacity-[0.01] z-10">
          <div
            style={{
              width: GOOGLE_BTN_MAX,
              height: "100%",
              transform: `scaleX(${btnWidth / GOOGLE_BTN_MAX})`,
              transformOrigin: "left center",
            }}
          >
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              theme="outline"
              size="large"
              text={text}
              width={GOOGLE_BTN_MAX}
              shape="rectangular"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
