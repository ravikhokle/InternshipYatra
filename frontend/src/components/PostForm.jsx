import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import { safeFormatDate } from "../utils/safeDate";
import { authInputClass, authButtonClass } from "./AuthLayout";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const DURATION_OPTIONS = ["1 Month", "2 Months", "3 Months", "6 Months", "Custom"];
const WORK_MODES = ["Remote", "Hybrid", "On-site"];

const EDITOR_BUTTONS = [
  "undo", "redo", "|",
  "paragraph", "|",
  "bold", "italic", "underline", "strikethrough", "|",
  "ul", "ol", "|",
  "outdent", "indent", "|",
  "align", "|",
  "link", "|",
  "hr", "eraser", "fullsize",
];

const EMPTY_FORM = {
  title: "",
  companyName: "",
  skills: "",
  stipend: "",
  locationCity: "",
  duration: "",
  startDate: "",
};

const parseWorkMode = (location = "") => {
  if (!location) return "On-site";
  if (location.toLowerCase() === "remote") return "Remote";
  if (location.toLowerCase().includes("hybrid")) return "Hybrid";
  return "On-site";
};

const parseLocationCity = (location = "", workMode) => {
  if (!location || location.toLowerCase() === "remote") return "";
  if (workMode === "Hybrid") {
    return location.replace(/^hybrid\s*[·\-]\s*/i, "").trim();
  }
  return location.replace(/\s*\(on-site\)$/i, "").trim();
};

const buildLocation = (workMode, city) => {
  if (workMode === "Remote") return "Remote";
  const trimmed = city.trim();
  if (!trimmed) return workMode;
  if (workMode === "Hybrid") return `Hybrid · ${trimmed}`;
  return `${trimmed} (On-site)`;
};

const FormField = ({ label, id, hint, error, required, children }) => (
  <div className="mb-4 sm:mb-5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const SectionCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-7">
    <div className="mb-5 pb-3 border-b border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const WorkModeChips = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {WORK_MODES.map((mode) => (
      <button
        key={mode}
        type="button"
        onClick={() => onChange(mode)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          value === mode
            ? "bg-purple-600 text-white border-purple-600"
            : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
        }`}
      >
        {mode}
      </button>
    ))}
  </div>
);

const SkillTags = ({ skills }) => {
  const tags = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const PostPreview = ({ form, content, workMode, companyLogo, isUnpaid }) => (
  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-4 sm:p-5 sticky top-24">
    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-3">Live Preview</p>
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 text-base line-clamp-2">
        {form.title || "Internship title"}
      </h3>
      <div className="flex items-center gap-2 mt-3">
        <img
          src={companyLogo || DEFAULT_LOGO}
          alt=""
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <span className="text-sm text-gray-700">{form.companyName || "Company name"}</span>
      </div>
      <div className="mt-3 space-y-1.5 text-xs text-gray-600">
        <p>
          <span className="font-medium text-gray-800">Location:</span>{" "}
          {buildLocation(workMode, form.locationCity) || "—"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Stipend:</span>{" "}
          {isUnpaid ? "Unpaid" : form.stipend ? `₹${form.stipend}/month` : "—"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Duration:</span> {form.duration || "—"}
        </p>
        {form.startDate && (
          <p>
            <span className="font-medium text-gray-800">Starts:</span>{" "}
            {safeFormatDate(form.startDate, "MMM d, yyyy")}
          </p>
        )}
      </div>
      {form.skills && <SkillTags skills={form.skills} />}
      {content && (
        <div
          className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 line-clamp-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  </div>
);

const calcProgress = (form, content, workMode, isUnpaid) => {
  const checks = [
    !!form.title?.trim(),
    !!form.companyName?.trim(),
    !!form.skills?.trim(),
    isUnpaid || form.stipend !== "",
    workMode === "Remote" || !!form.locationCity?.trim(),
    !!form.duration?.trim(),
    !!form.startDate,
    !!content?.replace(/<[^>]*>/g, "").trim(),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const PostForm = ({ mode = "create", postId, backTo = "/profile" }) => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [content, setContent] = useState("");
  const [workMode, setWorkMode] = useState("On-site");
  const [durationPreset, setDurationPreset] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [isUnpaid, setIsUnpaid] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Describe responsibilities, requirements, perks, and who should apply...",
      buttons: EDITOR_BUTTONS,
      buttonsMD: EDITOR_BUTTONS,
      buttonsSM: EDITOR_BUTTONS,
      buttonsXS: ["bold", "italic", "ul", "ol", "link"],
      toolbarAdaptive: false,
      toolbarSticky: true,
      height: 320,
      style: { fontFamily: "inherit", fontSize: "15px" },
    }),
    []
  );

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    const loadProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile", { params: { _id: userId } });
        if (mode === "create") {
          setForm((prev) => ({
            ...prev,
            companyName: res.data.companyName || prev.companyName,
          }));
        }
        setCompanyLogo(res.data.companyLogoURL || null);
      } catch {
        // non-blocking
      }
    };

    loadProfile();
  }, [mode]);

  useEffect(() => {
    if (mode !== "edit" || !postId) return;

    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get("/posts/findpost", { params: { id: postId } });
        const data = response.data;
        const modeFromLocation = parseWorkMode(data.location);
        const formattedDate = data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : "";

        const isPreset = DURATION_OPTIONS.slice(0, -1).includes(data.duration);

        setWorkMode(modeFromLocation);
        setForm({
          title: data.title || "",
          companyName: data.companyName || "",
          skills: data.skills || "",
          stipend: data.stipend === 0 ? "0" : String(data.stipend ?? ""),
          locationCity: parseLocationCity(data.location, modeFromLocation),
          duration: data.duration || "",
          startDate: formattedDate,
        });
        setContent(data.postDetails || "");
        setIsUnpaid(data.stipend === 0);
        setDurationPreset(isPreset ? data.duration : data.duration ? "Custom" : "");
        setCustomDuration(isPreset ? "" : data.duration || "");
      } catch {
        handleError("Failed to load internship post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [mode, postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDurationPreset = (preset) => {
    setDurationPreset(preset);
    if (preset !== "Custom") {
      setForm((prev) => ({ ...prev, duration: preset }));
      setCustomDuration("");
    } else {
      setForm((prev) => ({ ...prev, duration: customDuration }));
    }
    setErrors((prev) => ({ ...prev, duration: "" }));
  };

  const handleCustomDuration = (e) => {
    const value = e.target.value;
    setCustomDuration(value);
    setForm((prev) => ({ ...prev, duration: value }));
    setErrors((prev) => ({ ...prev, duration: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.companyName.trim()) next.companyName = "Company name is required";
    if (!form.skills.trim()) next.skills = "Add at least one skill";
    if (!isUnpaid && (form.stipend === "" || Number(form.stipend) < 0)) {
      next.stipend = "Enter a valid stipend or mark as unpaid";
    }
    if (workMode !== "Remote" && !form.locationCity.trim()) {
      next.locationCity = "City is required for hybrid/on-site roles";
    }
    if (!form.duration.trim()) next.duration = "Duration is required";
    if (!form.startDate) next.startDate = "Start date is required";
    if (!content.replace(/<[^>]*>/g, "").trim()) {
      next.postDetails = "Internship description is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return handleError("Please fix the highlighted fields");

    setSubmitting(true);
    const userId = localStorage.getItem("userID");
    const payload = {
      title: form.title.trim(),
      companyName: form.companyName.trim(),
      skills: form.skills.trim(),
      stipend: isUnpaid ? 0 : Number(form.stipend),
      location: buildLocation(workMode, form.locationCity),
      duration: form.duration.trim(),
      startDate: form.startDate,
      postDetails: content,
      userId,
    };

    try {
      if (mode === "edit") {
        const response = await axiosInstance.put("/posts/updatepost", {
          ...payload,
          postId,
        });
        if (response.data.success) {
          handleSuccess(response.data.message);
          setTimeout(() => navigate("/profile"), 1000);
        } else {
          handleError(response.data.message);
        }
      } else {
        const response = await axiosInstance.post("/posts/create", payload);
        if (response.data.success) {
          handleSuccess(response.data.message);
          setTimeout(() => navigate("/"), 1000);
        } else {
          handleError(response.data.message || response.data.error?.details?.[0]?.message);
        }
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditorChange = useCallback((val) => {
    setContent(val);
    setErrors((prev) => ({ ...prev, postDetails: "" }));
  }, []);

  const progress = calcProgress(form, content, workMode, isUnpaid);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f3f2ef] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading internship...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link to={backTo} className="text-purple-600 text-sm font-medium hover:underline">
            ← {mode === "edit" ? "Back to Profile" : "Back to Home"}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-3">
            <div>
              
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {mode === "edit" ? "Edit Internship Post" : "Post an Internship"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Create a detailed listing to attract the right candidates
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 min-w-[160px]">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Completion</span>
                <span className="font-semibold text-purple-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="Basic Information" subtitle="What role are you hiring for?">
                <FormField label="Internship Title" id="title" required error={errors.title}>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer Intern"
                    className={authInputClass}
                    maxLength={120}
                  />
                </FormField>

                <FormField label="Company Name" id="companyName" required error={errors.companyName}>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Your company or team name"
                    className={authInputClass}
                  />
                </FormField>

                <FormField
                  label="Required Skills"
                  id="skills"
                  required
                  hint="Comma-separated — React, Node.js, Figma"
                  error={errors.skills}
                >
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Git"
                    className={authInputClass}
                  />
                  <SkillTags skills={form.skills} />
                </FormField>
              </SectionCard>

              <SectionCard title="Compensation & Schedule" subtitle="Help interns understand the commitment">
                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Mode <span className="text-red-500">*</span>
                  </label>
                  <WorkModeChips value={workMode} onChange={setWorkMode} />
                </div>

                {workMode !== "Remote" && (
                  <FormField
                    label="City / Location"
                    id="locationCity"
                    required
                    error={errors.locationCity}
                  >
                    <input
                      id="locationCity"
                      name="locationCity"
                      type="text"
                      value={form.locationCity}
                      onChange={handleChange}
                      placeholder="Mumbai, Bangalore, Delhi"
                      className={authInputClass}
                    />
                  </FormField>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Stipend (₹/month)" id="stipend" error={errors.stipend}>
                    <input
                      id="stipend"
                      name="stipend"
                      type="number"
                      min="0"
                      value={form.stipend}
                      onChange={handleChange}
                      disabled={isUnpaid}
                      placeholder="10000"
                      className={`${authInputClass} disabled:bg-gray-50 disabled:text-gray-400`}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUnpaid}
                        onChange={(e) => {
                          setIsUnpaid(e.target.checked);
                          if (e.target.checked) {
                            setForm((prev) => ({ ...prev, stipend: "0" }));
                          }
                          setErrors((prev) => ({ ...prev, stipend: "" }));
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs text-gray-600">Unpaid internship</span>
                    </label>
                  </FormField>

                  <FormField label="Start Date" id="startDate" required error={errors.startDate}>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={authInputClass}
                    />
                  </FormField>
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleDurationPreset(opt)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          durationPreset === opt
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {durationPreset === "Custom" && (
                    <input
                      type="text"
                      value={customDuration}
                      onChange={handleCustomDuration}
                      placeholder="e.g. 4 Months, 12 Weeks"
                      className={authInputClass}
                    />
                  )}
                  {errors.duration && (
                    <p className="text-xs text-red-500 mt-1">{errors.duration}</p>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                title="Internship Description"
                subtitle="Use headings, bullet points, and links for a professional listing"
              >
                <div className="rounded-lg overflow-hidden border-2 border-gray-200 focus-within:border-purple-500 transition-colors">
                  <JoditEditor
                    ref={editorRef}
                    value={content}
                    config={editorConfig}
                    onChange={handleEditorChange}
                  />
                </div>
                {errors.postDetails && (
                  <p className="text-xs text-red-500 mt-2">{errors.postDetails}</p>
                )}
              </SectionCard>

              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={submitting} className={`${authButtonClass} sm:flex-1`}>
                  {submitting
                    ? "Saving..."
                    : mode === "edit"
                    ? "Update Internship"
                    : "Publish Internship"}
                </button>
                <Link
                  to={backTo}
                  className="sm:w-auto w-full py-2.5 sm:py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <PostPreview
                form={form}
                content={content}
                workMode={workMode}
                companyLogo={companyLogo}
                isUnpaid={isUnpaid}
              />

              <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-500 space-y-2">
                <p className="font-semibold text-gray-700 text-sm">Posting tips</p>
                <p>• Use a clear, searchable job title</p>
                <p>• List must-have skills separately in the skills field</p>
                <p>• Mention perks, mentorship, and certificate in the description</p>
                <p>• Keep start date realistic to get more applications</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
