export const PRIVACY_FIELDS = [
  { key: "headline", label: "Headline" },
  { key: "bio", label: "About / Bio" },
  { key: "city", label: "City / Location" },
  { key: "number", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "skills", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "linkedinURL", label: "LinkedIn" },
  { key: "githubURL", label: "GitHub" },
  { key: "companyName", label: "Company Name" },
  { key: "companyBio", label: "Company Description" },
];

export const DEFAULT_PRIVACY = {
  bio: true,
  city: true,
  number: false,
  email: false,
  headline: true,
  skills: true,
  education: true,
  experience: true,
  linkedinURL: true,
  githubURL: true,
  companyName: true,
  companyBio: true,
};

export const isFieldPublic = (privacySettings, field) =>
  privacySettings?.[field] !== false;

export const mergePrivacy = (settings) => ({
  ...DEFAULT_PRIVACY,
  ...(settings || {}),
});
