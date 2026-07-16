import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { isMongoObjectId } from "../utils/profileUsername";
import {
  IconBadge,
  MetaItem,
  ProfileIcons,
  SectionTitle,
  SocialLink,
  BackLink,
} from "../components/AppIcons";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";

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
        <p className="text-gray-500 text-sm">Loading profile...</p>
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

  const ContactItem = ({ icon: Icon, label, value, href }) => (
    <div className="flex items-center gap-3 py-2">
      <IconBadge icon={Icon} />
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-medium text-purple-600 hover:underline break-all">
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-10">
      <div className="h-32 sm:h-44 md:h-52 bg-gradient-to-r from-[#c599e52d] via-[#ca84fc63] to-[#e2ccf23c] w-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 md:-mt-[100px] relative z-10 overflow-visible">
        {accessToken && (
          <div className="mb-4">
            <BackLink to="/profile">Back to Profile</BackLink>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-visible">
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
              {(userData.linkedinURL || userData.githubURL) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {userData.linkedinURL && (
                    <SocialLink
                      href={userData.linkedinURL}
                      icon={ProfileIcons.LinkedIn}
                      label="LinkedIn"
                      className="text-blue-700 border-blue-100 hover:bg-blue-50"
                    />
                  )}
                  {userData.githubURL && (
                    <SocialLink
                      href={userData.githubURL}
                      icon={ProfileIcons.GitHub}
                      label="GitHub"
                      className="text-gray-800 hover:bg-gray-50"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible px-4 sm:px-8 py-5 sm:py-8">
          {hasContact && (
            <div className="pb-6 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Contact</h2>
              <div className="space-y-1">
                {userData.email && (
                  <ContactItem
                    icon={ProfileIcons.Email}
                    label="Email"
                    value={userData.email}
                    href={`mailto:${userData.email}`}
                  />
                )}
                {userData.number && (
                  <ContactItem
                    icon={ProfileIcons.Phone}
                    label="Phone"
                    value={userData.number}
                    href={`tel:${userData.number.replace(/\s/g, "")}`}
                  />
                )}
              </div>
            </div>
          )}

          {userData.bio && (
            <div className={`${hasContact ? "pt-6" : ""} pb-6 border-b border-gray-100`}>
              <SectionTitle icon={ProfileIcons.About}>About</SectionTitle>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mt-2">
                {userData.bio}
              </p>
            </div>
          )}

          {userData.skills?.length > 0 && (
            <div className="pt-6 pb-6 border-b border-gray-100">
              <SectionTitle icon={ProfileIcons.Skills}>Skills</SectionTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(userData.education || userData.experience) && (
            <div className="grid sm:grid-cols-2 gap-4 pt-6 pb-6 border-b border-gray-100">
              {userData.education && (
                <div>
                  <SectionTitle icon={ProfileIcons.Education}>Education</SectionTitle>
                  <p className="text-gray-600 text-sm whitespace-pre-line mt-2">
                    {userData.education}
                  </p>
                </div>
              )}
              {userData.experience && (
                <div>
                  <SectionTitle icon={ProfileIcons.Experience}>Experience</SectionTitle>
                  <p className="text-gray-600 text-sm whitespace-pre-line mt-2">
                    {userData.experience}
                  </p>
                </div>
              )}
            </div>
          )}

          {hasCompany && (
            <div className="pt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {userData.companyLogoURL && (
                    <img
                      src={userData.companyLogoURL}
                      alt={userData.companyName || "Company"}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <ProfileIcons.Company className="w-4 h-4 text-purple-600 shrink-0" />
                    {userData.companyName || "Company"}
                  </h2>
                </div>
                {userData.companyBio && (
                  <p className="text-gray-600 text-sm mt-2">{userData.companyBio}</p>
                )}
              </div>
            </div>
          )}

          {!hasAbout && !hasBackground && !hasCompany && !hasContact && (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">This user has limited public profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
