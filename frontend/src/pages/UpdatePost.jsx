import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
import JoditEditor from "jodit-react";

const UpdatePost = () => {
  const { id } = useParams();
  const editor = useRef(null);
  const [content, setContent] = React.useState("");
    const [post, setPost] = useState({
      title: "",
      companyName: "",
      skills: "",
      stipend: "",
      location: "",
      duration: "",
      startDate: "",
      postId: "",
      postDetails: content,
      userId: localStorage.getItem("userID"),
    });

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API}/posts/findpost`, {
            params: { id },
          });
    
          const postData = response.data;

          // format "yyyy-MM-dd"
          const formattedDate = new Date(postData.startDate).toISOString().split('T')[0];
    
          setPost({
            ...postData,
            startDate: formattedDate,
          });
          setPost({
            ...postData,
            startDate: formattedDate, postId: id,
          });
          setContent(postData.postDetails); 
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
    
      fetchPost();
    }, [id]);
    

  const myButtons = [
      "paragraph",
      "bold",
      "italic",
      "underline",
      "spellcheck",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "image",
      "fullsize",
    ];
  
    const config = {
      buttons: myButtons,
      buttonsMD: myButtons,
      buttonsSM: myButtons,
      buttonsXS: myButtons,
      placeholder: "Start typing here...",
      toolbarAdaptive: true,
      toolbarSticky: false,
    };
  
    const handleBlur = (newContent) => {
      setContent(newContent);
    };
  
    // jodit end

    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      const copyPost = { ...post };
      copyPost[name] = value;
      setPost(copyPost);
    };
  
    const handleCreatePost = async (event) => {
      event.preventDefault();
  
      const updatedPost = { ...post, postDetails: content };
  
      const {
        title,
        companyName,
        skills,
        stipend,
        location,
        duration,
        startDate,
        postDetails,
      } = updatedPost;
  
      if (
        !title ||
        !companyName ||
        !skills ||
        !stipend ||
        !location ||
        !duration ||
        !startDate ||
        !postDetails
      ) {
        return handleError("All Fields are required");
      }
  
      try {
        const url = `${import.meta.env.VITE_API}/posts/updatepost`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(post),
        });
        const result = await response.json();
        const { message, success, error } = result;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/userposts");
          }, 1000);
        } else if (error) {
          const details = error?.details[0].message;
          handleError(details);
        } else if (!success) {
          handleError(message);
        }
      } catch (error) {
        handleError(error);
      }
    };

  return (
<div className="px-5 md:px-10 lg:px-32 flex flex-col pb-10 bg-gray-100">
      <div className="mt-8 mb-4">
        <h1 className="text-2xl md:text-4xl font-[600]">Update Internship</h1>
      </div>

      <div>
        <form onSubmit={handleCreatePost}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col w-full md:w-1/2">
              <label htmlFor="title" className="py-3 font-bold">
                Internship Title
              </label>
              <input
                className="py-3 px-4 border-[#E7E7F1] bg-white border-2 outline-none"
                onChange={handleChange}
                type="text"
                id="title"
                name="title"
                autoFocus
                placeholder="Add internship title"
                value={post.title}
              />
            </div>

            <div className="flex flex-wrap gap-5">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="companyName" className="py-3 font-bold">
                  Company Name
                </label>
                <input
                  className="py-3 px-4 border-[#E7E7F1] border-2 outline-none"
                  onChange={handleChange}
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={post.companyName}
                />
              </div>

              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="skills" className="py-3 font-bold">
                  Skills
                </label>
                <input
                  className="py-3 px-4 border-[#E7E7F1] border-2 outline-none"
                  onChange={handleChange}
                  type="text"
                  id="skills"
                  name="skills"
                  placeholder="Enter required skills"
                  value={post.skills}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="stipend" className="py-3 font-bold">
                  Stipend
                </label>
                <input
                  className="py-3 px-4 border-[#E7E7F1] border-2 outline-none"
                  onChange={handleChange}
                  type="number"
                  id="stipend"
                  name="stipend"
                  placeholder="00, 10000"
                  value={post.stipend}
                />
              </div>

              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="location" className="py-3 font-bold">
                  Location
                </label>
                <input
                  className="py-3 px-4 border-[#E7E7F1] border-2 outline-none"
                  onChange={handleChange}
                  type="text"
                  id="location"
                  name="location"
                  placeholder="New York, Remote"
                  value={post.location}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="duration" className="py-3 font-bold">
                  Duration
                </label>
                <input
                  className="py-3 px-4 border-[#E7E7F1] border-2 outline-none"
                  onChange={handleChange}
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="3 Months / 6 Months"
                  value={post.duration}
                />
              </div>

              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="startDate" className="py-3 font-bold">
                  Start Date
                </label>
                <input
                  className="py-3 px-4 border-[#E7E7F1] border-2 outline-none"
                  onChange={handleChange}
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={post.startDate}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="postDetails" className="py-3 font-bold">
                Internship Details
              </label>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={handleBlur}
                onChange={() => { }}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white text-lg font-bold rounded border-2 bg-[#6300B3] border-[#6300B3] w-full md:w-1/3 py-3"
              >
                Publish
              </button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdatePost;