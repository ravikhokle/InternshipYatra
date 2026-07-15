import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const DisplayUserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const userId = localStorage.getItem("userID");
      try {
        const response = await axiosInstance.get("/profile/userPosts", {
          params: { _id: userId },
        });
        setUserPosts(response.data.reverse());
      } catch {
        handleError("Error while loading posts");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Delete this internship post? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const response = await axiosInstance.delete("/posts/deletepost", {
        data: { postId: id },
      });

      if (response.data?.success) {
        handleSuccess(response.data.message);
        setUserPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        handleError("Failed to delete the post");
      }
    } catch {
      handleError("Error while deleting post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <Link to="/profile" className="text-purple-600 text-sm font-medium hover:underline">
              ← Back to Profile
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">My Internship Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, edit, and track applications</p>
          </div>
          <Link
            to="/createpost"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Internship
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <img
                    src={post.companyLogoURL || DEFAULT_LOGO}
                    alt={post.companyName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                        <p className="text-sm text-gray-600 mt-0.5">{post.companyName}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full shrink-0">
                        Active
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-gray-500">
                      <span>📍 {post.location}</span>
                      <span>₹{post.stipend}/mo</span>
                      <span>⏱ {post.duration}</span>
                      {post.startDate && (
                        <span>Starts {format(new Date(post.startDate), "MMM d, yyyy")}</span>
                      )}
                    </div>

                    {post.skills && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                        <span className="font-medium text-gray-700">Skills:</span> {post.skills}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
                  <Link
                    to={`/internship/${post.id}`}
                    className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Listing
                  </Link>
                  <Link
                    to={`/appliedusers/${post.id}`}
                    className="px-3 py-1.5 text-sm border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Applicants
                  </Link>
                  <Link
                    to={`/updatepost/${post.id}`}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Edit Post
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(post.id)}
                    disabled={deletingId === post.id}
                    className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-sm text-gray-500 mb-5">Publish your first internship to start receiving applications.</p>
            <Link
              to="/createpost"
              className="inline-flex px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Post an Internship
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayUserPosts;
