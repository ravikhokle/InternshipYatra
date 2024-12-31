import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const AppliedUsers = () => {
  const { id } = useParams();
  const [appliedUsersData, setAppliedUsersData] = useState([]);

  useEffect(() => {
    const getAppliedUsersData = async () => {
      const url = `${import.meta.env.VITE_API}/posts/appliedUsers`;

      try {
        const response = await axios.get(url, {
          params: { postId: id },
        });

        setAppliedUsersData(response.data);

      } catch (error) {
        console.error("Error while fetching applied users", error.response?.data || error.message);
      }
    };

    getAppliedUsersData();
  }, []);

  return (

    <div className="px-5 md:px-16 lg:px-32 flex flex-col gap-5 mt-5">
    {appliedUsersData.length > 0 && (
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Title: {appliedUsersData[0]?.title}
      </h2>
    )}

    {appliedUsersData.length > 0 ? (
      <table className="w-full text-sm text-left text-gray-500 border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 md:px-6 py-3">No</th>
            <th className="px-4 md:px-6 py-3">Name</th>
            <th className="px-4 md:px-6 py-3">Resume</th>
            <th className="px-4 md:px-6 py-3">Profile</th>
          </tr>
        </thead>
        <tbody>
          {appliedUsersData.map((user, index) => (
            <tr
              key={user._id}
              className="bg-white border-b hover:bg-gray-50 transition"
            >
              <td className="px-4 md:px-6 py-4">{index + 1}</td>
              <td className="px-4 md:px-6 py-4">{user.name}</td>
              <td className="px-4 md:px-6 py-4 text-blue-600 hover:underline">
                <Link to={user.resumeURL} target="_blank">
                  Check
                </Link>
              </td>
              <td className="px-4 md:px-6 py-4 text-blue-600 hover:underline">
                <Link target="_blank" to={`/publicprofile/${user.userId}`}>View Profile</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-400 italic">No Applied Users found.</p>
    )}
  </div>


  );
};

export default AppliedUsers;
