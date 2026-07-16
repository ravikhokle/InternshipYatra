import { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../Utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";
import { mergePrivacy, PRIVACY_FIELDS, DEFAULT_PRIVACY } from "../utils/privacy";
import { MetaItem, ProfileIcons, SocialLink, LoadingSpinner } from "../components/AppIcons";
import { getPublicProfileUrl } from "../utils/profileUsername";
import { getInternshipUrl } from "../utils/internshipSlug";

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
        <ProfileIcons.Unlock className="w-3 h-3" />
        Public
      </>
    ) : (
      <>
        <ProfileIcons.Lock className="w-3 h-3" />
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
  <Link to={to} className="text-purple-600 text-sm font-medium hover:underline inline-flex items-center gap-1">
    <ProfileIcons.Edit className="w-4 h-4" />
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
  const [showPostsModal, setShowPostsModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this internship post? This cannot be undone.")) return;

    setDeletingPostId(postId);
    try {
      const response = await axiosInstance.delete("/posts/deletepost", {
        data: { postId },
      });

      if (response.data?.success) {
        handleSuccess(response.data.message);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        if (posts.length <= 1) setShowPostsModal(false);
      } else {
        handleError("Failed to delete the post");
      }
    } catch {
      handleError("Error while deleting post");
    } finally {
      setDeletingPostId(null);
    }
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
          <LoadingSpinner className="w-8 h-8" />
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const { percent: strength, checks } = calcProfileStrength(profile);
  const privacy = mergePrivacy(profile.privacySettings);

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-10">
      <div className="h-32 sm:h-44 md:h-52 bg-gradient-to-r from-[#c599e52d] via-[#ca84fc63] to-[#e2ccf23c] w-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 md:-mt-[100px] relative z-10 overflow-visible">
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
                <ProfileIcons.Camera className="w-4 h-4 text-gray-600" />
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
                    <MetaItem icon={ProfileIcons.Location}>{profile.city}</MetaItem>
                    {!privacy.city && <PrivacyBadge isPublic={false} />}
                  </span>
                )}
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
                to={getPublicProfileUrl(profile)}
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
                      <ProfileIcons.CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
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
                    <ProfileIcons.Email className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-700 break-all">{profile.email}</span>
                  </div>
                  <PrivacyBadge isPublic={privacy.email} />
                </div>
                {profile.number && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <ProfileIcons.Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-gray-700">{profile.number}</span>
                    </div>
                    <PrivacyBadge isPublic={privacy.number} />
                  </div>
                )}
                {(profile.linkedinURL || profile.githubURL) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.linkedinURL && (
                      <SocialLink
                        href={profile.linkedinURL}
                        icon={ProfileIcons.LinkedIn}
                        label="LinkedIn"
                        className="text-blue-700 border-blue-100 hover:bg-blue-50 text-xs"
                      />
                    )}
                    {profile.githubURL && (
                      <SocialLink
                        href={profile.githubURL}
                        icon={ProfileIcons.GitHub}
                        label="GitHub"
                        className="text-gray-800 hover:bg-gray-50 text-xs"
                      />
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
                    <ProfileIcons.Document className="w-5 h-5 text-red-500" />
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
                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <ProfileIcons.Search className="w-4 h-4" />
                  </span>
                  Browse Internships
                </Link>
                <Link to="/createpost" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                  <span className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                    <ProfileIcons.Plus className="w-4 h-4" />
                  </span>
                  Post an Internship
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50 text-sm text-red-600 transition-colors md:hidden">
                  <span className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <ProfileIcons.Logout className="w-4 h-4" />
                  </span>
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
                    <ProfileIcons.Edit className="w-3 h-3 text-gray-500" />
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
                    {posts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPostsModal(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50"
                      >
                        My Internships ({posts.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

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

      {showPostsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">My Internships</h3>
              <button
                type="button"
                onClick={() => setShowPostsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-gray-100 rounded-xl hover:border-purple-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={post.companyLogoURL || DEFAULT_COMPANY_LOGO}
                      alt={post.companyName}
                      className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={getInternshipUrl(post)}
                        className="font-medium text-gray-900 text-sm hover:text-purple-600 line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{post.companyName}</p>
                      <p className="text-xs text-gray-400 mt-1 inline-flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{post.location}</span>
                        <span>{post.stipend === 0 ? "Unpaid" : `₹${post.stipend}/mo`}</span>
                        {post.createdAt && (
                          <span>{format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
                    <Link
                      to={`/appliedusers/${post.id}`}
                      onClick={() => setShowPostsModal(false)}
                      className="px-3 py-1.5 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                    >
                      Applicants
                    </Link>
                    <Link
                      to={`/updatepost/${post.id}`}
                      onClick={() => setShowPostsModal(false)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingPostId === post.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 shrink-0">
              <Link
                to="/createpost"
                onClick={() => setShowPostsModal(false)}
                className="block text-center px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
              >
                + Post New Internship
              </Link>
            </div>
          </div>
        </div>
      )}

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
