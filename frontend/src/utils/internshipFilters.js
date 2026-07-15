export const WORK_MODES = ["All", "Remote", "On-site", "Hybrid"];

export const STIPEND_FILTERS = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
];

export const DATE_POSTED_FILTERS = [
  { label: "Any time", value: "all" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past week", value: "7d" },
  { label: "Past month", value: "30d" },
];

export const SORT_OPTIONS = [
  { label: "Most recent", value: "newest" },
  { label: "Highest stipend", value: "stipend-desc" },
];

export const getWorkMode = (location = "") => {
  const loc = location.toLowerCase();
  if (loc === "remote") return "Remote";
  if (loc.includes("hybrid")) return "Hybrid";
  return "On-site";
};

export const parseSkills = (skills = "") =>
  skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const isWithinDateRange = (createdAt, range) => {
  if (!createdAt || range === "all") return true;
  const posted = new Date(createdAt).getTime();
  const now = Date.now();
  const hours = { "24h": 24, "7d": 24 * 7, "30d": 24 * 30 };
  const limit = hours[range];
  if (!limit) return true;
  return now - posted <= limit * 60 * 60 * 1000;
};

export const filterPosts = (posts, filters) => {
  const {
    search = "",
    workMode = "All",
    stipend = "all",
    location = "",
    datePosted = "all",
  } = filters;

  const term = search.trim().toLowerCase();

  return posts.filter((post) => {
    if (term) {
      const haystack = `${post.title} ${post.companyName} ${post.skills} ${post.location}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }

    if (workMode !== "All" && getWorkMode(post.location) !== workMode) return false;

    if (stipend === "unpaid" && post.stipend !== 0) return false;
    if (stipend === "paid" && post.stipend <= 0) return false;

    if (location.trim()) {
      if (!post.location?.toLowerCase().includes(location.trim().toLowerCase())) return false;
    }

    if (!isWithinDateRange(post.createdAt, datePosted)) return false;

    return true;
  });
};

export const sortPosts = (posts, sortBy) => {
  const sorted = [...posts];

  switch (sortBy) {
    case "stipend-desc":
      return sorted.sort((a, b) => (b.stipend || 0) - (a.stipend || 0));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt || b.startDate).getTime() -
          new Date(a.createdAt || a.startDate).getTime()
      );
  }
};

export const paginatePosts = (posts, page, perPage) => {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: posts.slice(start, start + perPage),
    totalPages,
    currentPage: safePage,
    totalItems: posts.length,
  };
};

export const countActiveFilters = (filters) => {
  let count = 0;
  if (filters.workMode !== "All") count += 1;
  if (filters.stipend !== "all") count += 1;
  if (filters.location?.trim()) count += 1;
  if (filters.datePosted !== "all") count += 1;
  return count;
};
