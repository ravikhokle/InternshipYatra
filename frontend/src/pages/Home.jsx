import { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../Utils";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import serachIcon from "../assets/Images/search-icon.png";
import laptopImg from "../assets/Images/laptop girl.jpg";
import companyPlaceHolder from "../assets/Images/companyPlaceHolder.png";
import GPS from "../assets/Images/gps.png";
import axios from "axios";
import { Link } from "react-router-dom";
 

const Home = () => {
  const [Posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [url, setURL] = useState(`${import.meta.env.VITE_API}/posts/showall`);

  useEffect(() => {
    if (search) {
      setURL(`${import.meta.env.VITE_API}/posts/searchPost?title=${search}`);
    } else {
      setURL(`${import.meta.env.VITE_API}/posts/showall`);
    }
  }, [search]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const ShowPosts = async () => {
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result) {
        setPosts(result.reverse());
      } else {
        console.error("No posts found");
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    ShowPosts();
  }, [url]);

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#c599e52d] via-[#ca84fc63] to-[#e2ccf23c] w-full h-full md:p-5 pb-5">
        <div className="px-6 md:px-16 lg:px-32 flex flex-col lg:flex-row h-full sm:gap-10">
          {/* Left Section */}
          <div className="w-full lg:w-[50%] mb-6 lg:mb-0 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl pt-10 lg:pt-20">
              Explore Fresh Internship Opportunities Every Day
            </h1>
            <p className="py-5 text-[#303030]">
              Thousands of internships in all the leading sectors are waiting
              for you.
            </p>
            <div className="py-3 mt-5  md:mr-10 sm:px-5 sm:py-5 sm:mr-0  flex items-center bg-white rounded-md shadow-sm">
              <img
                className="h-5 px-3"
                src={serachIcon}
                alt="Search Icon"
              />
              <input
                className="outline-none w-1/2 flex-grow text-sm md:text-base"
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Internship Title"
              />
              <button
                type="button"
                className="px-5 py-2 mr-3 sm:mr-0 bg-purple-600 rounded-md text-white text-sm md:text-base"
                onClick={ShowPosts}
              >
                Search
              </button>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex items-center justify-center w-full lg:w-[50%]">
            <img
              className="rounded-md shadow-[0_4px_10px_rgba(0,0,0,.5)] max-w-full"
              src={laptopImg}
              alt="laptop image"
            />
          </div>
        </div>
      </div>

      {/* Latest Internships Section */}
      <div className="flex flex-col px-5 sm:px-6 md:px-16 lg:px-32 w-full bg-gray-50 pb-14">
        <div className="w-full px-2 py-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-center pt-10">
            Latest Internships
          </h1>
          <p className="py-5 text-center text-[#303030]">
            Unlock Your Career Potential with the Right Internship
          </p>
        </div>
        <div className="posts flex flex-wrap justify-center sm:gap-5 lg:gap-16">
          {Posts.length > 0 ? (
            Posts.map((post, index) => (
              <div
                key={index}
                className="post w-full sm:w-[90%] md:w-[45%] px-5 py-5 my-5 rounded-lg shadow-lg  border-2 border-purple-300 bg-gradient-to-r from-[#c599e52d] from-7% via-[#ca84fc38] via-51% to-[#e2ccf23c] to-98%"
              >
                <h2 className="text-xl md:text-2xl font-semibold">{post.title}</h2>
                <div className="flex justify-between mt-5 mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-[50px] h-[50px] rounded-full shadow-md"
                      src={post.companyLogoURL || companyPlaceHolder}
                      alt={post.companyName}
                    />
                    <p className="text-sm md:text-base">{post.companyName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img className="h-[18px]" src={GPS} alt="Location icon" />
                    <p className="text-sm md:text-base">{post.location}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-5">
                  <p>
                    <span className="text-gray-600">Stipend per month:</span>{" "}
                    &#8377;{post.stipend}
                  </p>
                  <p>
                    <span className="text-gray-600">Required skills:</span>{" "}
                    {post.skills}
                  </p>
                  <p>
                    <span className="text-gray-600">Duration:</span>{" "}
                    {post.duration}
                  </p>
                  <p>
                    <span className="text-gray-600">Starting Date:</span>{" "}
                    {format(new Date(post.startDate), "dd.MM.yyyy")}
                  </p>
                  <div className="flex justify-between items-center mt-2 gap-2">
                    <p className="text-blue-600 text-sm md:text-base">
                      <Link to={`/internship/${post._id}`}>View Details</Link>
                    </p>
                    <button
                      onClick={() => handleApplyClick(post._id)}
                      type="button"
                      className="px-4 py-2 bg-purple-600 rounded-md text-white text-sm md:text-base"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm md:text-base">No posts found.</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
