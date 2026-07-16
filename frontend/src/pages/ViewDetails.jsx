import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { getWorkMode, parseSkills } from "../utils/internshipFilters";
import { getInternshipUrl } from "../utils/internshipSlug";
import { isReservedSlug } from "../utils/reservedRoutes";
import { safeFormatDate } from "../utils/safeDate";
import { AppIcons, BackLink, IconBadge, LoadingSpinner, MetaTag, SectionTitle } from "../components/AppIcons";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <IconBadge icon={Icon} />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const ViewDetails = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const identifier = slug || id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const getInternshipDetails = async () => {
      try {
        const isObjectId = /^[a-f\d]{24}$/i.test(identifier || "");
        const params = isObjectId ? { id: identifier } : { slug: identifier };
        const response = await axiosInstance.get("/posts/viewdetails", { params });
        const fetchedPost = response.data?.[0] || null;
        setPost(fetchedPost);

        if (fetchedPost?.slug && id && !slug) {
          navigate(getInternshipUrl(fetchedPost), { replace: true });
        }
      } catch {
        handleError("Error while fetching internship details");
      } finally {
        setLoading(false);
      }
    };

    if (identifier) getInternshipDetails();
  }, [identifier, id, slug, navigate]);

  useEffect(() => {
    const checkApplied = async () => {
      const userId = localStorage.getItem("userID");
      if (!userId || !post?._id) {
        setHasApplied(false);
        return;
      }
      try {
        const response = await axiosInstance.get("/profile/userApplications", {
          params: { _id: userId },
        });
        const applied = (response.data || []).some(
          (app) => String(app.postId) === String(post._id)
        );
        setHasApplied(applied);
      } catch {
        setHasApplied(false);
      }
    };
    checkApplied();
  }, [post?._id]);

  useEffect(() => {
    if (!post) return undefined;

    const previousTitle = document.title;
    document.title = `${post.title} at ${post.companyName} | InternshipYatra`;

    return () => {
      document.title = previousTitle;
    };
  }, [post]);

  const handleApplyClick = async () => {
    const _id = localStorage.getItem("userID");
    if (!_id) return handleError("Please login to apply for this internship");

    setApplying(true);
    try {
      const response = await axiosInstance.get("/posts/apply", {
        params: { postId: post._id, _id },
      });

      if (response.status === 200) {
        setHasApplied(true);
        handleSuccess(response?.data.message || "Application submitted successfully!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setHasApplied(true);
      }
      handleError(error.response?.data?.message || error.message);
    } finally {
      setApplying(false);
    }
  };

  if (slug && isReservedSlug(slug)) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex flex-col items-center justify-center gap-4 px-4">
        <AppIcons.Alert className="w-12 h-12 text-gray-300" />
        <p className="text-gray-600">Internship not found</p>
        <BackLink to="/">Back to internships</BackLink>
      </div>
    );
  }

  const skills = parseSkills(post.skills);
  const workMode = getWorkMode(post.location);

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <BackLink to="/" className="mt-0">Back to internships</BackLink>

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
                <MetaTag icon={AppIcons.Location}>{post.location}</MetaTag>
                <MetaTag icon={AppIcons.WorkMode} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {workMode}
                </MetaTag>
                <MetaTag icon={AppIcons.Stipend} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md">
                  {post.stipend === 0 ? "Unpaid" : `₹${post.stipend}/month`}
                </MetaTag>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <SectionTitle icon={AppIcons.Skills} className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  Skills Required
                </SectionTitle>
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
              <SectionTitle icon={AppIcons.Document} className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                About this internship
              </SectionTitle>
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
                icon={AppIcons.Stipend}
                label="Stipend"
                value={post.stipend === 0 ? "Unpaid" : `₹${post.stipend} per month`}
              />
              <InfoRow icon={AppIcons.Duration} label="Duration" value={post.duration} />
              <InfoRow
                icon={AppIcons.Calendar}
                label="Start Date"
                value={safeFormatDate(post.startDate, "MMMM d, yyyy") || "Not specified"}
              />
              <InfoRow icon={AppIcons.Location} label="Location" value={post.location} />
              <InfoRow icon={AppIcons.WorkMode} label="Work Mode" value={workMode} />

              {hasApplied ? (
                <div className="w-full mt-5 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold rounded-lg text-center text-sm">
                  Already Applied
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  disabled={applying}
                  className="w-full mt-5 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              )}

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
