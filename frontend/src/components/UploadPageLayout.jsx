import { Link } from "react-router-dom";
import { AuthCard } from "./AuthLayout";
import { AppIcons } from "./AppIcons";

export const UploadPageShell = ({ title, subtitle, backTo = "/profile", children }) => (
  <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#f5f0ff] via-white to-[#ede9fe] py-6 sm:py-10 px-4 sm:px-6">
    <div className="max-w-xl w-full mx-auto">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium mb-4 sm:mb-6 transition-colors"
      >
        <AppIcons.ArrowLeft className="w-4 h-4" />
        Back to profile
      </Link>

      <AuthCard>
        <div className="mb-6 sm:mb-8">
          <p className="text-purple-600 font-semibold text-xs uppercase tracking-widest mb-2">
            Profile
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {children}
      </AuthCard>
    </div>
  </div>
);

export const FileDropZone = ({
  id,
  accept,
  hint,
  onFileSelect,
  children,
  className = "",
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-purple-200 rounded-xl p-6 sm:p-8 cursor-pointer bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400 transition-colors ${className}`}
    >
      {children}
      {hint && <p className="text-xs text-gray-500 text-center">{hint}</p>}
    </label>
  );
};

export const uploadButtonClass =
  "w-full py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed";
