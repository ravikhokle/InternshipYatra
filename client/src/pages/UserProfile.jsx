import { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../Utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";
import { mergePrivacy, PRIVACY_FIELDS, DEFAULT_PRIVACY } from "../utils/privacy";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";
const DEFAULT_COMPANY_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const STATUS_STYLES = {
  Applied: "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const calcProfileStrength = (p) => {
  const checks = [
    { label: "Profile photo", done: !!p.profileImgURL },
    { label: "Headline", done: !!p.headline },
    { label: "About / Bio", done: !!p.bio },
    { label: "Location", done: !!p.city },
    { label: "Phone number", done: !!p.number },
    { label: "Resume uploaded", done: !!p.resumeURL },
    { label: "Skills added", done: p.skills?.length > 0 },
    { label: "Education", done: !!p.education },
  ];
  const done = checks.filter((c) => c.done).length;
  return { percent: Math.round((done / checks.length) * 100), checks };
};

const PrivacyBadge = ({ isPublic }) => (
  <span
    className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
      isPublic ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
    }`}
  >
    {isPublic ? (
      <>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Public
      </>
    ) : (
      <>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Private
      </>
    )}
  </span>
);

const SectionCard = ({ title, action, children, className = "", privacy }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h2>
        {privacy !== undefined && <PrivacyBadge isPublic={privacy} />}
      </div>
      {action}
    </div>
    <div className="px-4 sm:px-6 py-4 sm:py-5">{children}</div>
  </div>
);

const EditLink = ({ to, label = "Edit" }) => (
  <Link to={to} className="text-purple-600 text-sm font-medium hover:underline flex items-center gap-1">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
    {label}
  </Link>
);

const EmptyState = ({ text, action }) => (
  <div className="text-center py-6 sm:py-8">
    <p className="text-gray-400 text-sm mb-3">{text}</p>
    {action}
  </div>
);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, appsRes, postsRes] = await Promise.all([
          axiosInstance.get("/profile", { params: { _id: auth.userID } }),
          axiosInstance.get("/profile/userApplications", { params: { _id: auth.userID } }),
          axiosInstance.get("/profile/userPosts", { params: { _id: auth.userID } }),
        ]);
        setProfile(profileRes.data);
        setApplications(appsRes.data);
        setPosts(postsRes.data);
      } catch (error) {
        handleError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (auth.userID) fetchAll();
  }, [auth.userID]);

  const handleLogout = async () => {
    await logout();
    handleSuccess("Logged out");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await axiosInstance.delete("/profile/delete-account");
      if (response.data.success) {
        await logout();
        handleSuccess("Account deleted successfully");
        setTimeout(() => navigate("/"), 1500);
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const { percent: strength, checks } = calcProfileStrength(profile);
  const privacy = mergePrivacy(profile.privacySettings);
  const memberSince = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM yyyy")
    : "Recently";

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-10">
      {/* Cover banner */}
      <div className="h-32 sm:h-44 md:h-52 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10 overflow-visible">
        {/* Profile header card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-visible">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 sm:px-8 py-5 sm:py-6">
            {/* Avatar — left of name, inside card */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 ring-2 ring-purple-100">
                <img
                  src={profile.profileImgURL || DEFAULT_AVATAR}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <Link
                to="/updateprofileimage"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                title="Change photo"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </Link>
            </div>

            {/* Name & details — right of photo */}
            <div className="flex-1 min-w-[180px] text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1 line-clamp-2">
                {profile.headline || "Add a headline — e.g. Computer Science Student | Aspiring Developer"}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {profile.city}
                    {!privacy.city && <PrivacyBadge isPublic={false} />}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {memberSince}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-row gap-2 w-full sm:w-auto sm:ml-auto">
              <Link
                to="/updateuserprofile"
                className="flex-1 sm:flex-none px-4 py-2 border-2 border-purple-600 text-purple-600 font-semibold rounded-full text-sm hover:bg-purple-50 transition-colors text-center"
              >
                Edit Profile
              </Link>
              <Link
                to={`/publicprofile/${auth.userID}`}
                className="flex-1 sm:flex-none px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-full text-sm hover:bg-gray-50 transition-colors text-center"
              >
                Public View
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile strength */}
            <SectionCard title="Profile Strength">
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-semibold text-purple-600">{strength}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
              <ul className="space-y-2">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-xs sm:text-sm">
                    {c.done ? (
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      </svg>
                    )}
                    <span className={c.done ? "text-gray-700" : "text-gray-400"}>{c.label}</span>
                  </li>
                ))}
              </ul>
              {strength < 100 && (
                <Link
                  to="/updateuserprofile"
                  className="mt-4 block text-center text-sm text-purple-600 font-medium hover:underline"
                >
                  Complete your profile →
                </Link>
              )}
            </SectionCard>

            {/* Stats */}
            <SectionCard title="Your Activity">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-purple-700">{applications.length}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Applied</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-indigo-700">{posts.length}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Posted</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-green-700">
                    {applications.filter((a) => a.status === "Accepted").length}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Accepted</p>
                </div>
              </div>
            </SectionCard>

            {/* Contact */}
            <SectionCard title="Contact Info">
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 break-all">{profile.email}</span>
                  </div>
                  <PrivacyBadge isPublic={privacy.email} />
                </div>
                {profile.number && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{profile.number}</span>
                    </div>
                    <PrivacyBadge isPublic={privacy.number} />
                  </div>
                )}
                {(profile.linkedinURL || profile.githubURL) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.linkedinURL && (
                      <a href={profile.linkedinURL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs font-medium">
                        LinkedIn ↗
                      </a>
                    )}
                    {profile.githubURL && (
                      <a href={profile.githubURL} target="_blank" rel="noreferrer" className="text-gray-800 hover:underline text-xs font-medium">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                )}
                <Link to="/updateuserprofile" className="mt-3 block text-center text-xs text-purple-600 hover:underline">
                  Manage privacy settings →
                </Link>
              </div>
            </SectionCard>
            <SectionCard
              title="Resume"
              action={<EditLink to="/updateresume" label="Upload" />}
            >
              {profile.resumeURL ? (
                <Link
                  to="/view-resume"
                  className="flex items-center gap-3 p-3 border-2 border-dashed border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">View Resume</p>
                    <p className="text-xs text-gray-500">PDF · Opens on InternshipYatra</p>
                  </div>
                </Link>
              ) : (
                <EmptyState
                  text="No resume uploaded yet"
                  action={
                    <Link to="/updateresume" className="text-purple-600 text-sm font-medium hover:underline">
                      Upload resume to apply →
                    </Link>
                  }
                />
              )}
            </SectionCard>

            {/* Quick actions */}
            <SectionCard title="Quick Actions">
              <div className="space-y-2">
                <Link to="/" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">🔍</span>
                  Browse Internships
                </Link>
                <Link to="/createpost" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                  <span className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">➕</span>
                  Post an Internship
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50 text-sm text-red-600 transition-colors md:hidden">
                  <span className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">🚪</span>
                  Logout
                </button>
              </div>
            </SectionCard>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* About */}
            <SectionCard title="About" privacy={privacy.bio} action={<EditLink to="/updateuserprofile" />}>
              {profile.bio ? (
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">{profile.bio}</p>
              ) : (
                <EmptyState
                  text="Tell recruiters about yourself — your goals, interests, and what you're looking for."
                  action={<EditLink to="/updateuserprofile" label="Add about section" />}
                />
              )}
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills" privacy={privacy.skills} action={<EditLink to="/updateuserprofile" />}>
              {profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState
                  text="Add skills like React, Python, UI/UX Design to stand out to recruiters."
                  action={<EditLink to="/updateuserprofile" label="Add skills" />}
                />
              )}
            </SectionCard>

            {/* Education & Experience */}
            <div className="grid sm:grid-cols-2 gap-4">
              <SectionCard title="Education" privacy={privacy.education} action={<EditLink to="/updateuserprofile" />}>
                {profile.education ? (
                  <p className="text-gray-700 text-sm whitespace-pre-line">{profile.education}</p>
                ) : (
                  <p className="text-gray-400 text-sm italic">Add your college, degree & year</p>
                )}
              </SectionCard>
              <SectionCard title="Experience" privacy={privacy.experience} action={<EditLink to="/updateuserprofile" />}>
                {profile.experience ? (
                  <p className="text-gray-700 text-sm whitespace-pre-line">{profile.experience}</p>
                ) : (
                  <p className="text-gray-400 text-sm italic">Add internships, projects or work experience</p>
                )}
              </SectionCard>
            </div>

            {/* My Applications */}
            <SectionCard
              title={`My Applications (${applications.length})`}
              action={
                <Link to="/" className="text-purple-600 text-sm font-medium hover:underline">
                  Find more →
                </Link>
              }
            >
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 border border-gray-100 rounded-lg hover:border-purple-100 hover:bg-purple-50/30 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{app.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Applied {format(new Date(app.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[app.status] || STATUS_STYLES.Applied}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <p className="text-center text-xs text-gray-400 pt-1">
                      +{applications.length - 5} more applications
                    </p>
                  )}
                </div>
              ) : (
                <EmptyState
                  text="You haven't applied to any internships yet. Start exploring!"
                  action={
                    <Link to="/" className="inline-block px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                      Browse Internships
                    </Link>
                  }
                />
              )}
            </SectionCard>

            {/* Recruiter / Company hub */}
            <SectionCard
              title="Recruiter Hub"
              privacy={privacy.companyName}
              action={<EditLink to="/updateuserprofile" label="Edit company" />}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <img
                    src={profile.companyLogoURL || DEFAULT_COMPANY_LOGO}
                    alt="Company"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-200 object-cover shadow-sm"
                  />
                  <Link
                    to="/updatecompanylogo"
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                    {profile.companyName || "Your Company / Organization"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                    {profile.companyBio || "Add your company description to attract the best interns."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Link to="/createpost" className="px-4 py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700">
                      + Post Internship
                    </Link>
                    <Link to="/userposts" className="px-4 py-2 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50">
                      Manage Posts ({posts.length})
                    </Link>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Posted internships preview */}
            {posts.length > 0 && (
              <SectionCard title="Your Posted Internships" action={<EditLink to="/userposts" label="Manage all" />}>
                <div className="space-y-3">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-gray-100 rounded-lg">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{post.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {post.companyName} · {post.location} · ₹{post.stipend}/mo
                        </p>
                      </div>
                      <Link
                        to={`/appliedusers/${post.id}`}
                        className="self-start sm:self-center text-xs text-purple-600 font-medium hover:underline whitespace-nowrap"
                      >
                        View applicants →
                      </Link>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Danger zone */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-red-100">
                <h2 className="text-base sm:text-lg font-semibold text-red-600">Danger Zone</h2>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <p className="text-gray-600 text-sm mb-4">
                  Permanently delete your account, posts, and applications. This cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete your account?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This will permanently remove your profile, internship posts, and all application data.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
