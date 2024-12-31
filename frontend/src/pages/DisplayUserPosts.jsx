import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
 

const DisplayUserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const id = localStorage.getItem("userID");
      const url = `${import.meta.env.VITE_API}/profile/userPosts`;

      try {
        const response = await axios.get(url, {
          params: { _id: id },
        });

        setUserPosts(response.data);
      } catch (error) {
        console.error("Error while fetching user posts", error.response?.data || error.message);
      }
    };

    fetchUserPosts();
  }, []);

  return (

    <div className="px-5 md:px-16 lg:px-32 flex flex-col gap-5 mt-5 mb-5">
  <table className="w-[100%] text-sm text-left text-gray-500  border border-gray-200 rounded-lg shadow-md">
    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
      <tr>
        <th className="px-6 py-3">Title</th>
        <th className="px-6 py-3">Applied Users</th>
      </tr>
    </thead>
    <tbody>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <tr
            key={post.id}
            className="bg-white border-b hover:bg-gray-50 transition"
          >
            <td className="px-6 py-4">{post.title}</td>
            <td className="px-6 py-4 text-blue-600 hover:underline">
              <Link to={`/appliedusers/${post.id}`}>View</Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="2"
            className="px-6 py-4 text-center text-gray-400 italic"
          >
            No posts available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
  );
  
};

export default DisplayUserPosts;
