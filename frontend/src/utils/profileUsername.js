export const getPublicProfileUrl = (user) => {
  const username = user?.username;
  if (username) return `/publicprofile/${username}`;

  const id = user?._id || user?.userID || user?.userId;
  if (id) return `/publicprofile/${id}`;

  return "/profile";
};

export const isMongoObjectId = (value) => /^[a-f\d]{24}$/i.test(value || "");

const USERNAME_COOLDOWN_MS = 15 * 24 * 60 * 60 * 1000;

export const normalizeUsername = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

export const getUsernameEditStatus = (usernameChangedAt) => {
  if (!usernameChangedAt) {
    return { canChange: true, daysRemaining: 0 };
  }

  const elapsed = Date.now() - new Date(usernameChangedAt).getTime();
  if (elapsed >= USERNAME_COOLDOWN_MS) {
    return { canChange: true, daysRemaining: 0 };
  }

  const daysRemaining = Math.ceil((USERNAME_COOLDOWN_MS - elapsed) / (24 * 60 * 60 * 1000));
  return { canChange: false, daysRemaining };
};
