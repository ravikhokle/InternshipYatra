import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { getWorkMode, parseSkills } from "../utils/internshipFilters";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 text-purple-600">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const ViewDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const getInternshipDetails = async () => {
      try {
        const response = await axiosInstance.get("/posts/viewdetails", { params: { id } });
        setPost(response.data?.[0] || null);
      } catch {
        handleError("Error while fetching internship details");
      } finally {
        setLoading(false);
      }
    };

    if (id) getInternshipDetails();
  }, [id]);

  const handleApplyClick = async () => {
    const _id = localStorage.getItem("userID");
    if (!_id) return handleError("Please login to apply for this internship");

    setApplying(true);
    try {
      const response = await axiosInstance.get("/posts/apply", {
        params: { postId: post._id, _id },
      });

      if (response.status === 200) {
        handleSuccess(response?.data.message || "Application submitted successfully!");
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600">Internship not found</p>
        <Link to="/" className="text-purple-600 font-medium hover:underline">
          ← Back to internships
        </Link>
      </div>
    );
  }

  const skills = parseSkills(post.skills);
  const workMode = getWorkMode(post.location);

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-purple-600 text-sm font-medium hover:underline">
          ← Back to internships
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8 mt-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <img
              src={post.companyLogoURL || DEFAULT_LOGO}
              alt={post.companyName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{post.title}</h1>
              <p className="text-base text-gray-600 mt-1">{post.companyName}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">📍 {post.location}</span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{workMode}</span>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md">
                  {post.stipend === 0 ? "Unpaid" : `₹${post.stipend}/month`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">About this internship</h2>
              <div
                className="text-sm sm:text-base text-gray-700 leading-relaxed internship-details"
                dangerouslySetInnerHTML={{ __html: post.postDetails }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Overview</h2>
              <p className="text-xs text-gray-500 mb-4">Key details at a glance</p>

              <InfoRow
                icon={<span className="text-sm">₹</span>}
                label="Stipend"
                value={post.stipend === 0 ? "Unpaid" : `₹${post.stipend} per month`}
              />
              <InfoRow
                icon={<span className="text-sm">⏱</span>}
                label="Duration"
                value={post.duration}
              />
              <InfoRow
                icon={<span className="text-sm">📅</span>}
                label="Start Date"
                value={format(new Date(post.startDate), "MMMM d, yyyy")}
              />
              <InfoRow
                icon={<span className="text-sm">📍</span>}
                label="Location"
                value={post.location}
              />
              <InfoRow
                icon={<span className="text-sm">💼</span>}
                label="Work Mode"
                value={workMode}
              />

              <button
                type="button"
                onClick={handleApplyClick}
                disabled={applying}
                className="w-full mt-5 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Make sure your resume is uploaded before applying
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
