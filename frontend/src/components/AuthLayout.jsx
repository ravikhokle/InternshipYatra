const AUTH_IMAGE =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079379/frontend/bw0k9pjed2irxfm3kmh7.jpg";

const AuthHero = ({ title, description }) => (
  <div className="hidden md:flex flex-col gap-6 lg:gap-10 order-2 lg:order-1">
    <img
      src={AUTH_IMAGE}
      alt="InternshipYatra"
      className="w-full h-auto max-h-[280px] lg:max-h-[420px] xl:max-h-[480px] object-contain mx-auto"
    />
    <div className="text-center lg:text-left px-1 sm:px-2">
      <p className="text-purple-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3">
        InternshipYatra
      </p>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
        {title}
      </h2>
      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
        {description}
      </p>
    </div>
  </div>
);

export const AuthPageShell = ({ children, heroTitle, heroDescription }) => (
  <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#f5f0ff] via-white to-[#ede9fe] flex items-center py-6 sm:py-10 px-4 sm:px-6">
    <div className="max-w-6xl w-full mx-auto">
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
        <AuthHero title={heroTitle} description={heroDescription} />
        <div className="order-1 lg:order-2 w-full">{children}</div>
      </div>
    </div>
  </div>
);

export const AuthCard = ({ children, className = "" }) => (
  <div
    className={`w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(124,58,237,0.12)] p-5 sm:p-7 md:p-8 ${className}`}
  >
    {children}
  </div>
);

export const AuthDivider = ({ text }) => (
  <div className="flex items-center gap-2 sm:gap-3 my-4 sm:my-5">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">
      {text}
    </span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

export const authInputClass =
  "w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 transition-colors text-sm sm:text-base";

export const authButtonClass =
  "w-full py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed";

export const OtpInputClass = (filled) =>
  `w-10 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-lg outline-none transition-all ${
    filled
      ? "border-purple-500 bg-purple-50 text-purple-700"
      : "border-gray-200 text-gray-800"
  } focus:border-purple-500 focus:ring-2 focus:ring-purple-100`;

export const CenteredAuthPage = ({ children }) => (
  <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#f5f0ff] via-white to-[#ede9fe] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
    <div className="w-full max-w-md">{children}</div>
  </div>
);
