import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import {
  UploadPageShell,
  FileDropZone,
  uploadButtonClass,
} from "../components/UploadPageLayout";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";

const MAX_SIZE_MB = 5;

const UpdateProfileImg = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();
  const { updateProfileImage } = useAuth();

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const id = localStorage.getItem("userID");
        const response = await axiosInstance.get("/profile", { params: { _id: id } });
        setCurrentImage(response.data.profileImgURL || null);
      } catch (error) {
        handleError("Could not load current profile photo");
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
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      handleError("Please choose a photo first");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("profileImage", profileImage);
    const id = localStorage.getItem("userID");

    try {
      const response = await axiosInstance.put("/profile/updateProfileImg", data, {
        params: { _id: id },
      });

      const { message, success, userProfile } = response.data;

      if (success) {
        handleSuccess(message);
        updateProfileImage(userProfile);
        setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayImage = previewUrl || currentImage || DEFAULT_AVATAR;

  return (
    <UploadPageShell
      title="Update profile photo"
      subtitle="A clear photo helps recruiters recognize you. Square images work best."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={displayImage}
              alt="Profile preview"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-purple-100"
            />
            {previewUrl && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-medium rounded-full whitespace-nowrap">
                New preview
              </span>
            )}
          </div>

          <FileDropZone
            id="profileImage"
            accept="image/*"
            hint={`JPG, PNG or WebP · Max ${MAX_SIZE_MB}MB`}
            onFileSelect={handleFile}
            className="mb-0"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
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
            id="profileImage"
            name="profileImage"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {profileImage && (
          <p className="text-xs text-gray-500 text-center truncate">
            Selected: {profileImage.name}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || fetching || !profileImage}
          className={uploadButtonClass}
        >
          {loading ? "Uploading..." : "Save profile photo"}
        </button>

        {currentImage && !profileImage && (
          <p className="text-xs text-center text-gray-400">
            Your current photo is shown above. Choose a new file to replace it.
          </p>
        )}
      </form>
    </UploadPageShell>
  );
};

export default UpdateProfileImg;
