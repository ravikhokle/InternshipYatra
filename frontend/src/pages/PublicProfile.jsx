import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { isMongoObjectId } from "../utils/profileUsername";
import {
  MetaItem,
  ProfileIcons,
  SocialLink,
  BackLink,
  LoadingSpinner,
} from "../components/AppIcons";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";
const DEFAULT_COMPANY_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="px-4 sm:px-6 py-4 sm:py-5">{children}</div>
  </div>
);

const ContactRow = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3 min-w-0">
    <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {href ? (
        <a
          href={href}
          className="text-sm font-medium text-gray-800 hover:text-purple-600 break-all transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-gray-800 break-all">{value}</p>
      )}
    </div>
  </div>
);

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { accessToken } = auth;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const params = isMongoObjectId(username)
          ? { _id: username }
          : { username };

        const response = await axiosInstance.get("/profile/publicProfile", { params });
        const data = response.data;

        if (isMongoObjectId(username) && data.username) {
          navigate(`/publicprofile/${data.username}`, { replace: true });
          return;
        }

        setUserData(data);
      } catch (error) {
        handleError("Could not load this profile");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfileData();
  }, [username, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="w-8 h-8" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-600 text-sm">This profile could not be found or is unavailable.</p>
        <BackLink to="/">Back to internships</BackLink>
      </div>
    );
  }

  const hasAbout = userData.bio || userData.headline;
  const hasBackground = userData.skills?.length || userData.education || userData.experience;
  const hasCompany = userData.companyName || userData.companyBio;
  const hasContact = userData.email || userData.number;
  const hasSocial = userData.linkedinURL || userData.githubURL;
  const showSidebar = hasContact || hasSocial;
  const hasBothBackground =
    Boolean(userData.education) && Boolean(userData.experience);

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-16 sm:pb-20">
      <div className="h-32 sm:h-44 md:h-52 bg-gradient-to-r from-[#c599e52d] via-[#ca84fc63] to-[#e2ccf23c] w-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 md:-mt-[100px] relative">
        {accessToken && (
          <div className="mb-4 relative z-10">
            <BackLink to="/profile">Back to Profile</BackLink>
          </div>
        )}

        {/* Header card — z-10 only here so it sits above the banner, not the footer */}
        <div className="relative z-10 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 sm:px-8 py-5 sm:py-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 ring-2 ring-purple-100">
                <img
                  src={userData.profileImgURL || DEFAULT_AVATAR}
                  alt={userData.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[180px] text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {userData.name}
              </h1>
              {userData.headline && (
                <p className="text-gray-600 text-sm sm:text-base mt-1 line-clamp-2">
                  {userData.headline}
                </p>
              )}
              {userData.city && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
                  <MetaItem icon={ProfileIcons.Location}>{userData.city}</MetaItem>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body — sidebar + main, aligned like UserProfile */}
        <div className={`grid gap-4 items-start ${showSidebar ? "lg:grid-cols-3" : ""}`}>
          {showSidebar && (
            <div className="lg:col-span-1 space-y-4">
              <SectionCard title="Contact">
                <div className="space-y-4">
                  {userData.email && (
                    <ContactRow
                      icon={ProfileIcons.Email}
                      label="Email"
                      value={userData.email}
                      href={`mailto:${userData.email}`}
                    />
                  )}
                  {userData.number && (
                    <ContactRow
                      icon={ProfileIcons.Phone}
                      label="Phone"
                      value={userData.number}
                      href={`tel:${userData.number.replace(/\s/g, "")}`}
                    />
                  )}
                  {hasSocial && (
                    <div className="pt-1 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Social profiles</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.linkedinURL && (
                          <SocialLink
                            href={userData.linkedinURL}
                            icon={ProfileIcons.LinkedIn}
                            label="LinkedIn"
                            className="text-blue-700 border-blue-100 hover:bg-blue-50 text-xs"
                          />
                        )}
                        {userData.githubURL && (
                          <SocialLink
                            href={userData.githubURL}
                            icon={ProfileIcons.GitHub}
                            label="GitHub"
                            className="text-gray-800 hover:bg-gray-50 text-xs"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          <div className={`space-y-4 ${showSidebar ? "lg:col-span-2" : ""}`}>
            {userData.bio && (
              <SectionCard title="About">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {userData.bio}
                </p>
              </SectionCard>
            )}

            {userData.skills?.length > 0 && (
              <SectionCard title="Skills">
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {(userData.education || userData.experience) && (
              <div
                className={`grid gap-4 items-start ${
                  hasBothBackground ? "sm:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {userData.education && (
                  <SectionCard title="Education" className="h-full">
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                      {userData.education}
                    </p>
                  </SectionCard>
                )}
                {userData.experience && (
                  <SectionCard title="Experience" className="h-full">
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                      {userData.experience}
                    </p>
                  </SectionCard>
                )}
              </div>
            )}

            {hasCompany && (
              <SectionCard title="Company">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <img
                    src={userData.companyLogoURL || DEFAULT_COMPANY_LOGO}
                    alt={userData.companyName || "Company"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-200 object-cover shadow-sm shrink-0 mx-auto sm:mx-0"
                  />
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                      {userData.companyName || "Company"}
                    </h3>
                    {userData.companyBio && (
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-line">
                        {userData.companyBio}
                      </p>
                    )}
                  </div>
                </div>
              </SectionCard>
            )}

            {!hasAbout && !hasBackground && !hasCompany && !hasContact && (
              <SectionCard title="Profile">
                <p className="text-gray-400 text-sm text-center py-4">
                  This user has limited public profile information.
                </p>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
