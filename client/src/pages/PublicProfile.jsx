import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { handleError } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png";

const PublicProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/profile/publicProfile", { params: { _id: id } });
        setUserData(response.data);
      } catch (error) {
        handleError("Could not load this profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!userData) return null;

  const memberSince = userData.createdAt
    ? format(new Date(userData.createdAt), "MMMM yyyy")
    : null;

  const hasAbout = userData.bio || userData.headline;
  const hasBackground = userData.skills?.length || userData.education || userData.experience;
  const hasCompany = userData.companyName || userData.companyBio;

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-10">
      <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10 overflow-visible">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible px-4 sm:px-8 py-5 sm:py-8">
          <div className="flex flex-row items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 ring-2 ring-purple-100">
                <img
                  src={userData.profileImgURL || DEFAULT_AVATAR}
                  alt={userData.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="text-left flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userData.name}</h1>
              {userData.headline && (
                <p className="text-gray-600 text-sm sm:text-base mt-1">{userData.headline}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                {userData.city && <span>📍 {userData.city}</span>}
                {memberSince && <span>Joined {memberSince}</span>}
              </div>
              {(userData.linkedinURL || userData.githubURL) && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {userData.linkedinURL && (
                    <a href={userData.linkedinURL} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                      LinkedIn ↗
                    </a>
                  )}
                  {userData.githubURL && (
                    <a href={userData.githubURL} target="_blank" rel="noreferrer" className="text-gray-800 text-sm hover:underline">
                      GitHub ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {userData.bio && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{userData.bio}</p>
            </div>
          )}

          {userData.skills?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((s) => (
                  <span key={s} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(userData.education || userData.experience) && (
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {userData.education && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">Education</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{userData.education}</p>
                </div>
              )}
              {userData.experience && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">Experience</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{userData.experience}</p>
                </div>
              )}
            </div>
          )}

          {hasCompany && (
            <div className="mt-5 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-900">{userData.companyName || "Company"}</h2>
              {userData.companyBio && (
                <p className="text-gray-600 text-sm mt-1">{userData.companyBio}</p>
              )}
            </div>
          )}

          {!hasAbout && !hasBackground && !hasCompany && (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm">This user has limited public profile information.</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link to="/" className="text-purple-600 text-sm font-medium hover:underline">
              ← Explore internships on InternshipYatra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
