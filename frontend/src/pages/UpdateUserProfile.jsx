import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { authInputClass, authButtonClass } from "../components/AuthLayout";
import { mergePrivacy, PRIVACY_FIELDS, DEFAULT_PRIVACY } from "../utils/privacy";
import { getUsernameEditStatus, normalizeUsername } from "../utils/profileUsername";

const PrivacyToggle = ({ isPublic, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0 ${
      isPublic
        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    }`}
  >
    {isPublic ? (
      <>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Public
      </>
    ) : (
      <>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Private
      </>
    )}
  </button>
);

const Field = ({ label, id, children, hint, privacyKey, isPublic, onTogglePrivacy }) => (
  <div className="mb-4 sm:mb-5">
    <div className="flex items-center justify-between gap-2 mb-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {privacyKey && (
        <PrivacyToggle isPublic={isPublic} onChange={onTogglePrivacy} />
      )}
    </div>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const UpdateUserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    city: "",
    number: "",
    headline: "",
    skills: "",
    education: "",
    experience: "",
    linkedinURL: "",
    githubURL: "",
    companyName: "",
    companyBio: "",
  });
  const [initialUsername, setInitialUsername] = useState("");
  const [usernameChangedAt, setUsernameChangedAt] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: "" });
  const [privacy, setPrivacy] = useState({ ...DEFAULT_PRIVACY });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");

  const usernameEditStatus = useMemo(
    () => getUsernameEditStatus(usernameChangedAt),
    [usernameChangedAt]
  );

  const normalizedUsername = useMemo(() => normalizeUsername(user.username), [user.username]);
  const usernameChanged = normalizedUsername !== initialUsername;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/profile", { params: { _id: userID } });
        const data = response.data;
        setUser({
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
          bio: data.bio || "",
          city: data.city || "",
          number: data.number || "",
          headline: data.headline || "",
          skills: (data.skills || []).join(", "),
          education: data.education || "",
          experience: data.experience || "",
          linkedinURL: data.linkedinURL || "",
          githubURL: data.githubURL || "",
          companyName: data.companyName || "",
          companyBio: data.companyBio || "",
        });
        setInitialUsername(data.username || "");
        setUsernameChangedAt(data.usernameChangedAt || null);
        setPrivacy(mergePrivacy(data.privacySettings));
      } catch (error) {
        handleError(error.response?.data?.message || "Failed to load profile");
      }
    };
    fetchProfileData();
  }, [userID]);

  useEffect(() => {
    if (!usernameEditStatus.canChange || !usernameChanged || normalizedUsername.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: "" });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus({ checking: true, available: null, message: "" });
      try {
        const response = await axiosInstance.get("/profile/checkUsername", {
          params: { username: normalizedUsername, _id: userID },
        });
        setUsernameStatus({
          checking: false,
          available: response.data.available,
          message: response.data.message,
        });
      } catch (error) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: error.response?.data?.message || "Could not check username",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [normalizedUsername, usernameChanged, usernameEditStatus.canChange, userID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email) {
      return handleError("Name and email are required");
    }

    if (usernameChanged) {
      if (!usernameEditStatus.canChange) {
        return handleError(`You can change your username again in ${usernameEditStatus.daysRemaining} day(s).`);
      }

      if (normalizedUsername.length < 3) {
        return handleError("Username must be at least 3 characters");
      }

      if (usernameStatus.available === false) {
        return handleError(usernameStatus.message || "This username is not available");
      }
    }

    setLoading(true);

    try {
      const result = await axiosInstance.put(
        "/profile/updateProfile",
        {
          name: user.name,
          email: user.email,
          username: user.username,
          bio: user.bio,
          city: user.city,
          number: user.number,
          headline: user.headline,
          skills: user.skills,
          education: user.education,
          experience: user.experience,
          linkedinURL: user.linkedinURL,
          githubURL: user.githubURL,
          companyName: user.companyName,
          companyBio: user.companyBio,
          privacySettings: privacy,
        },
        { params: { _id: userID } }
      );

      if (result.data.success) {
        handleSuccess(result.data.message);
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        handleError(result.data.message);
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/profile" className="text-purple-600 text-sm font-medium hover:underline">
            ← Back to Profile
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-3">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build your profile and control what others see on your public page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Basic Info
            </h2>

            <Field label="Full Name *" id="name">
              <input id="name" name="name" type="text" value={user.name} onChange={handleChange} className={authInputClass} required />
            </Field>

            <Field
              label="Username"
              id="username"
              hint={
                !usernameEditStatus.canChange
                  ? `You can change your username again in ${usernameEditStatus.daysRemaining} day(s).`
                  : "Used in your public profile URL. You can change it once every 15 days if available."
              }
            >
              <input
                id="username"
                name="username"
                type="text"
                value={user.username}
                onChange={handleChange}
                className={`${authInputClass} ${!usernameEditStatus.canChange ? "bg-gray-100 cursor-not-allowed" : ""}`}
                disabled={!usernameEditStatus.canChange}
                placeholder="your-username"
              />
              {usernameEditStatus.canChange && usernameChanged && normalizedUsername && (
                <p className={`text-xs mt-1 ${
                  usernameStatus.checking
                    ? "text-gray-400"
                    : usernameStatus.available
                      ? "text-emerald-600"
                      : usernameStatus.available === false
                        ? "text-red-600"
                        : "text-gray-400"
                }`}>
                  {usernameStatus.checking
                    ? "Checking availability..."
                    : usernameStatus.message || (normalizedUsername.length < 3 ? "Username must be at least 3 characters" : "")}
                </p>
              )}
              {usernameEditStatus.canChange && normalizedUsername && (
                <p className="text-xs text-gray-400 mt-1">
                  Public URL: /publicprofile/{normalizedUsername || "your-username"}
                </p>
              )}
            </Field>

            <Field label="Email *" id="email" privacyKey="email" isPublic={privacy.email} onTogglePrivacy={() => togglePrivacy("email")}>
              <input id="email" name="email" type="email" value={user.email} onChange={handleChange} className={authInputClass} required />
            </Field>

            <Field label="Headline" id="headline" privacyKey="headline" hint="e.g. B.Tech CSE Student | React Developer" isPublic={privacy.headline} onTogglePrivacy={() => togglePrivacy("headline")}>
              <input id="headline" name="headline" type="text" value={user.headline} onChange={handleChange} placeholder="Your professional headline" className={authInputClass} />
            </Field>

            <Field label="About / Bio" id="bio" privacyKey="bio" isPublic={privacy.bio} onTogglePrivacy={() => togglePrivacy("bio")}>
              <textarea id="bio" name="bio" value={user.bio} onChange={handleChange} rows={4} placeholder="Tell recruiters about yourself..." className={`${authInputClass} resize-y`} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City" id="city" privacyKey="city" isPublic={privacy.city} onTogglePrivacy={() => togglePrivacy("city")}>
                <input id="city" name="city" type="text" value={user.city} onChange={handleChange} placeholder="Mumbai, India" className={authInputClass} />
              </Field>
              <Field label="Phone" id="number" privacyKey="number" isPublic={privacy.number} onTogglePrivacy={() => togglePrivacy("number")}>
                <input id="number" name="number" type="text" value={user.number} onChange={handleChange} placeholder="+91 98765 43210" className={authInputClass} />
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Skills & Background
            </h2>

            <Field label="Skills" id="skills" privacyKey="skills" hint="Comma-separated — React, Python, Figma" isPublic={privacy.skills} onTogglePrivacy={() => togglePrivacy("skills")}>
              <input id="skills" name="skills" type="text" value={user.skills} onChange={handleChange} placeholder="React, JavaScript, UI Design" className={authInputClass} />
            </Field>

            <Field label="Education" id="education" privacyKey="education" isPublic={privacy.education} onTogglePrivacy={() => togglePrivacy("education")}>
              <textarea id="education" name="education" value={user.education} onChange={handleChange} rows={3} className={`${authInputClass} resize-y`} />
            </Field>

            <Field label="Experience" id="experience" privacyKey="experience" isPublic={privacy.experience} onTogglePrivacy={() => togglePrivacy("experience")}>
              <textarea id="experience" name="experience" value={user.experience} onChange={handleChange} rows={3} className={`${authInputClass} resize-y`} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="LinkedIn URL" id="linkedinURL" privacyKey="linkedinURL" isPublic={privacy.linkedinURL} onTogglePrivacy={() => togglePrivacy("linkedinURL")}>
                <input id="linkedinURL" name="linkedinURL" type="url" value={user.linkedinURL} onChange={handleChange} placeholder="https://linkedin.com/in/you" className={authInputClass} />
              </Field>
              <Field label="GitHub URL" id="githubURL" privacyKey="githubURL" isPublic={privacy.githubURL} onTogglePrivacy={() => togglePrivacy("githubURL")}>
                <input id="githubURL" name="githubURL" type="url" value={user.githubURL} onChange={handleChange} placeholder="https://github.com/you" className={authInputClass} />
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Company / Recruiter</h2>
            <p className="text-xs text-gray-500 mb-4">Optional — for posting internships</p>

            <Field label="Company Name" id="companyName" privacyKey="companyName" isPublic={privacy.companyName} onTogglePrivacy={() => togglePrivacy("companyName")}>
              <input id="companyName" name="companyName" type="text" value={user.companyName} onChange={handleChange} className={authInputClass} />
            </Field>

            <Field label="Company Description" id="companyBio" privacyKey="companyBio" isPublic={privacy.companyBio} onTogglePrivacy={() => togglePrivacy("companyBio")}>
              <textarea id="companyBio" name="companyBio" value={user.companyBio} onChange={handleChange} rows={3} className={`${authInputClass} resize-y`} />
            </Field>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Privacy Overview</h2>
            <p className="text-xs text-gray-500 mb-4">
              Toggle each field above, or review all settings here. Private fields are hidden on your public profile.
            </p>
            <div className="space-y-2">
              {PRIVACY_FIELDS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{label}</span>
                  <PrivacyToggle
                    isPublic={privacy[key]}
                    onChange={() => togglePrivacy(key)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? "Saving..." : "Save Profile & Privacy"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserProfile;
