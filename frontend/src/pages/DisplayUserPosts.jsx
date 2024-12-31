import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
 

const DisplayUserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const userId = localStorage.getItem("userID");
      const url = `${import.meta.env.VITE_API}/profile/userPosts`;

      try {
        const response = await axios.get(url, {
          params: { _id: userId },
        });

        setUserPosts(response.data.reverse());
      } catch (error) {
        handleError("Error while loading posts");
      }
    };

    fetchUserPosts();
  }, []);

  
  const handleDeleteClick = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API}/posts/deletepost`, {
        data: { postId: id },
      });
  
      if (response.data && response.data.success) {
        handleSuccess(response.data.message);
        setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      } else {
        handleError("Failed to delete the post");
      }
    } catch (error) {
      handleError("Error while deleting post");
    }
  };

  return (

    <div className="px-5 md:px-16 lg:px-32 flex flex-col gap-5 mt-5 mb-5">
      <table className="w-[100%] text-sm text-left text-gray-500 border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-2 py-3 sm:px-6">Title</th>
            <th className="px-2 py-3 sm:px-6">Applied Users</th>
            <th className="px-2 py-3 sm:px-6">Update</th>
            <th className="px-2 py-3 sm:px-6">Delete</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <tr
                key={post.id}
                className="bg-white border-b hover:bg-gray-50 transition"
              >
                <td className="px-2 py-4 sm:px-6">{post.title}</td>
                <td className="px-2 py-4 sm:px-6 text-blue-600 hover:underline">
                  <Link to={`/appliedusers/${post.id}`}>View</Link>
                </td>
                <td className="px-2 py-4 sm:px-6 text-blue-600 hover:underline">
                  <Link to={`/updatepost/${post.id}`}>Edit</Link>
                </td>
                <td className="px-2 py-4 sm:px-6 text-blue-600 hover:text-red-600 transition-colors cursor-pointer">
                  <span onClick={() => handleDeleteClick(post.id)}>Delete</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-2 py-4 sm:px-6 text-center text-gray-400 italic"
              >
                No posts available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
  
};

export default DisplayUserPosts;
