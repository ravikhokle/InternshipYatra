import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AppIcons, BackLink, LoadingSpinner } from "../components/AppIcons";
import { getPublicProfileUrl } from "../utils/profileUsername";

const AppliedUsers = () => {
  const { id } = useParams();
  const [appliedUsersData, setAppliedUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAppliedUsersData = async () => {
      try {
        const response = await axiosInstance.get("/posts/appliedUsers", {
          params: { postId: id },
        });
        setAppliedUsersData(response.data.reverse());
      } catch (error) {
        console.error("Error while fetching applied users", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    getAppliedUsersData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5">
          <BackLink to="/profile">Back to Profile</BackLink>
        </div>

        {appliedUsersData.length > 0 && (
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <AppIcons.Applicants className="w-5 h-5 text-purple-600 shrink-0" />
            <span>Applicants for: {appliedUsersData[0]?.title}</span>
          </h2>
        )}

        {appliedUsersData.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 md:px-6 py-3">No</th>
                  <th className="px-4 md:px-6 py-3">Name</th>
                  <th className="px-4 md:px-6 py-3">Resume</th>
                  <th className="px-4 md:px-6 py-3">Profile</th>
                </tr>
              </thead>
              <tbody>
                {appliedUsersData.map((user, index) => (
                  <tr key={user._id} className="bg-white border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 md:px-6 py-4">{index + 1}</td>
                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 md:px-6 py-4">
                      <Link
                        to={`/view-resume/${user.userId}`}
                        state={{ from: `/appliedusers/${id}`, fromLabel: "Applicants" }}
                        className="inline-flex items-center gap-1.5 text-purple-600 hover:underline"
                      >
                        <AppIcons.Document className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <Link
                        to={getPublicProfileUrl(user)}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                      >
                        <AppIcons.About className="w-4 h-4" />
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center mt-6">
            <AppIcons.Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applicants found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedUsers;
