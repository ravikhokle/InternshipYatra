export const RESERVED_SLUGS = new Set([
  "login",
  "signup",
  "profile",
  "about",
  "contact",
  "createpost",
  "forgot-password",
  "verify-otp",
  "reset-password",
  "verify-signup-otp",
  "updateuserprofile",
  "updateresume",
  "updateprofileimage",
  "view-resume",
  "updatecompanylogo",
  "publicprofile",
  "internship",
]);

export const isReservedSlug = (slug) =>
  slug && RESERVED_SLUGS.has(String(slug).toLowerCase());
