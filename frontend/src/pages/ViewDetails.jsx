import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import companyPlaceHolder from "../assets/Images/companyPlaceHolder.png";
import GPS from "../assets/Images/gps.png";
import { format } from "date-fns";
import { handleError, handleSuccess } from "../Utils";
import { ToastContainer } from "react-toastify";
 

const ViewDetails = () => {
  const { id } = useParams();
  const [Posts, setPosts] = useState([]);

  useEffect(() => {
    const getInternshipDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/posts/viewdetails`,
          {
            params: { id },
          }
        );
        setPosts(response.data);
      } catch (err) {
        handleError("Error while fetching internship details");
      }
    };

    if (id) {
      getInternshipDetails();
    }
  }, [id]);

  const handleApplyClick = async (postId) => {
    const _id = localStorage.getItem("userID");

    const applyURL = `${import.meta.env.VITE_API}/posts/apply`;

    try {
      const response = await axios.get(applyURL, {
        params: { postId, _id },
      });

      if (response.status === 200) {
        handleSuccess(
          response?.data.message ||
            "You have successfully applied for the internship!"
        );
      }
    } catch (error) {
      handleError(error.response?.data.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:px-32">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-10">
          Internship Details
        </h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {Posts.length > 0 ? (
            Posts.map((post, index) => (
              <div
                key={index}
                className="w-full bg-white p-6 border-t-4 border-purple-600"
              >
                {/* Title */}
                <h2 className="text-3xl font-semibold text-purple-800 mb-3">
                  {post.title}
                </h2>

                {/* Company and Location */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.companyLogoURL || companyPlaceHolder}
                      alt={post.companyName}
                      className="w-12 h-12 rounded-full border border-gray-300"
                    />
                    <p className="font-medium text-gray-700">{post.companyName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <img src={GPS} alt="Location icon" className="w-5 h-5" />
                    <p>{post.location}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="text-sm text-gray-700 space-y-4">
                  <p>
                    <span className="font-medium">Stipend:</span> &#8377;
                    {post.stipend || "Not mentioned"}
                  </p>
                  <p>
                    <span className="font-medium">Skills Required:</span>{" "}
                    {post.skills || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {post.duration}
                  </p>
                  <p>
                    <span className="font-medium">Start Date:</span>{" "}
                    {format(new Date(post.startDate), "dd.MM.yyyy")}
                  </p>
                  <div className="flex flex-col">
                    <p className="font-medium">Details:</p>
                    <div className="mt-5" id="internshipDetails" dangerouslySetInnerHTML={{ __html: post.postDetails }} />
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-6">
                  <button
                    onClick={() => handleApplyClick(post._id)}
                    className="w-[100%] md:w-[50%] bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-center">No posts found.</p>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ViewDetails;
