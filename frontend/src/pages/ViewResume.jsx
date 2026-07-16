import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { handleError } from "../Utils";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";

const parseApiError = async (error) => {
  const data = error.response?.data;

  if (data instanceof ArrayBuffer) {
    try {
      const text = new TextDecoder().decode(data);
      const json = JSON.parse(text);
      return json.message || "Could not load resume";
    } catch {
      return "Could not load resume";
    }
  }

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const json = JSON.parse(text);
      return json.message || "Could not load resume";
    } catch {
      return "Could not load resume";
    }
  }

  return error.response?.data?.message || "Could not load resume";
};

const ViewResume = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const viewerUserId = userId || localStorage.getItem("userID");
  const isOwnResume = !userId || userId === localStorage.getItem("userID");

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    let cancelled = false;

    const loadResume = async () => {
      if (!viewerUserId) {
        handleError("User not found");
        setLoading(false);
        setLoadError("User not found");
        return;
      }

      setLoading(true);
      setLoadError(null);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });

      try {
        const profileRes = await axiosInstance.get("/profile", {
          params: { _id: viewerUserId },
        });

        if (cancelled) return;
        setProfile(profileRes.data);

        if (!profileRes.data?.resumeURL) {
          const msg = "No resume uploaded yet";
          handleError(msg);
          setLoadError(msg);
          setLoading(false);
          return;
        }

        const pdfRes = await axiosInstance.get(`/profile/resume/${viewerUserId}`, {
          responseType: "arraybuffer",
        });

        if (cancelled) return;

        const blob = new Blob([pdfRes.data], { type: "application/pdf" });
        const objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (error) {
        if (!cancelled) {
          const msg = await parseApiError(error);
          handleError(msg);
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResume();
    return () => {
      cancelled = true;
    };
  }, [viewerUserId]);

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${profile?.name || "resume"}-resume.pdf`;
    link.click();
  };

  const displayName = profile?.name || "Resume";
  const returnPath = location.state?.from;
  const returnLabel = location.state?.fromLabel || "Back";
  const backTo = isOwnResume && !returnPath ? "/profile" : returnPath;
  const backLabel = isOwnResume && !returnPath ? "Back to profile" : `Back to ${returnLabel}`;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef]">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go back
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={profile?.profileImgURL || DEFAULT_AVATAR}
                alt={displayName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-purple-100 shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{displayName}</h1>
                {profile?.headline && (
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{profile.headline}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-md">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Resume
                  </span>
                  <span className="text-xs text-gray-400">PDF Document</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isOwnResume && (
                <Link
                  to="/updateresume"
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Replace
                </Link>
              )}
              {pdfUrl && (
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white min-h-[75vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
              <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading document...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
              title={`${displayName} resume`}
              className="w-full min-h-[75vh] border-0 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">{loadError || "No resume available to display."}</p>
              {isOwnResume && (
                <Link
                  to="/updateresume"
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload resume
                </Link>
              )}
            </div>
          )}
        </div>

        {pdfUrl && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Viewing securely on InternshipYatra · {displayName}&apos;s resume
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewResume;
