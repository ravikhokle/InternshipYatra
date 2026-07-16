export const getInternshipUrl = (post) => {
  const slug = post?.slug;
  if (slug) return `/${slug}`;

  const id = post?._id || post?.id;
  if (id) return `/internship/${id}`;

  return "/";
};
