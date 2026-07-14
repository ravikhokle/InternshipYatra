import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import {
  UploadPageShell,
  FileDropZone,
  uploadButtonClass,
} from "../components/UploadPageLayout";

const MAX_SIZE_MB = 5;

const UpdateResume = () => {
  const [resume, setResume] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const id = localStorage.getItem("userID");
        const response = await axiosInstance.get("/profile", { params: { _id: id } });
        setHasExisting(!!response.data.resumeURL);
      } catch (error) {
        handleError("Could not load resume status");
      } finally {
        setFetching(false);
      }
    };
    fetchCurrent();
  }, []);

  const handleFile = (file) => {
    if (file.type !== "application/pdf") {
      handleError("Only PDF files are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      handleError(`Resume must be under ${MAX_SIZE_MB}MB`);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setResume(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      handleError("Please choose a PDF resume first");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("resume", resume);
    const id = localStorage.getItem("userID");

    try {
      const result = await axiosInstance.put("/profile/updateResume", data, {
        params: { _id: id },
      });

      const { message, success } = result.data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/view-resume"), 1000);
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploadPageShell
      title="Upload resume"
      subtitle="Upload your latest resume in PDF format. Recruiters will view it directly on InternshipYatra."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {hasExisting && (
          <div className="flex items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-emerald-800 font-medium truncate">Resume already uploaded</p>
            </div>
            <Link
              to="/view-resume"
              className="text-sm text-emerald-700 font-semibold hover:underline shrink-0"
            >
              View current →
            </Link>
          </div>
        )}

        <FileDropZone
          id="resume"
          accept="application/pdf"
          hint={`PDF only · Max ${MAX_SIZE_MB}MB`}
          onFileSelect={handleFile}
        >
          <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">
            <span className="text-purple-600">Click to upload</span> or drag and drop your resume
          </p>
        </FileDropZone>

        <input
          type="file"
          id="resume"
          name="resume"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {resume && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 truncate text-center">
              Selected: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-48 sm:h-56">
              <iframe
                src={previewUrl}
                title="Resume preview"
                className="w-full h-full"
              />
            </div>
            <p className="text-xs text-center text-gray-400">Preview before uploading</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || fetching || !resume}
          className={uploadButtonClass}
        >
          {loading ? "Uploading..." : hasExisting ? "Replace resume" : "Upload resume"}
        </button>
      </form>
    </UploadPageShell>
  );
};

export default UpdateResume;
