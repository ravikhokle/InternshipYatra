import { useParams } from "react-router-dom";
import PostForm from "../components/PostForm";

const UpdatePost = () => {
  const { id } = useParams();
  return <PostForm mode="edit" postId={id} backTo="/userposts" />;
};

export default UpdatePost;
