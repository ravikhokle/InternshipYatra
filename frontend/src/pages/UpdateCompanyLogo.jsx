import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import {
  UploadPageShell,
  FileDropZone,
  uploadButtonClass,
} from "../components/UploadPageLayout";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const MAX_SIZE_MB = 5;

const UpdateCompanyLogo = () => {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const id = localStorage.getItem("userID");
        const response = await axiosInstance.get("/profile", { params: { _id: id } });
        setCurrentLogo(response.data.companyLogoURL || null);
        setCompanyName(response.data.companyName || "");
      } catch (error) {
        handleError("Could not load current company logo");
      } finally {
        setFetching(false);
      }
    };
    fetchCurrent();
  }, []);

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      handleError("Please select an image file (JPG, PNG, or WebP)");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      handleError(`Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCompanyLogo(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyLogo) {
      handleError("Please choose a logo first");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("companyLogo", companyLogo);
    const id = localStorage.getItem("userID");

    try {
      const response = await axiosInstance.put("/profile/updateCompanyLogo", data, {
        params: { _id: id },
      });

      const { message, success } = response.data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayLogo = previewUrl || currentLogo || DEFAULT_LOGO;

  return (
    <UploadPageShell
      title="Update company logo"
      subtitle="Your logo appears on internship posts and your recruiter profile. Square images with a clear background work best."
      backTo="/profile"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {companyName && (
          <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-purple-600 font-medium">Company</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{companyName}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={displayLogo}
              alt="Company logo preview"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-white shadow-lg ring-2 ring-purple-100 bg-white"
            />
            {previewUrl && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-medium rounded-full whitespace-nowrap">
                New preview
              </span>
            )}
          </div>

          <FileDropZone
            id="companyLogo"
            accept="image/*"
            hint={`JPG, PNG or WebP · Max ${MAX_SIZE_MB}MB · Recommended 400×400px`}
            onFileSelect={handleFile}
            className="mb-0"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              <span className="text-purple-600">Click to upload</span> or drag and drop
            </p>
          </FileDropZone>

          <input
            type="file"
            id="companyLogo"
            name="companyLogo"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {companyLogo && (
          <p className="text-xs text-gray-500 text-center truncate">
            Selected: {companyLogo.name}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || fetching || !companyLogo}
          className={uploadButtonClass}
        >
          {loading ? "Uploading..." : "Save company logo"}
        </button>

        {currentLogo && !companyLogo && (
          <p className="text-xs text-center text-gray-400">
            Your current logo is shown above. Choose a new file to replace it.
          </p>
        )}

        {!companyName && (
          <p className="text-xs text-center text-gray-400">
            Add your company name in{" "}
            <Link to="/updateuserprofile" className="text-purple-600 hover:underline">
              Edit Profile
            </Link>{" "}
            so it appears on your posts.
          </p>
        )}
      </form>
    </UploadPageShell>
  );
};

export default UpdateCompanyLogo;
