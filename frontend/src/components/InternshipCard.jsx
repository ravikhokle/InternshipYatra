import { Link } from "react-router-dom";
import { getWorkMode, parseSkills } from "../utils/internshipFilters";
import { getInternshipUrl } from "../utils/internshipSlug";
import { safeFormatDate } from "../utils/safeDate";
import { AppIcons, MetaTag } from "../components/AppIcons";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/i0qh0dcvftwjvbdmw4ou.png";

const InternshipCard = ({ post, onApply, hasApplied = false }) => {
  const skills = parseSkills(post.skills);
  const workMode = getWorkMode(post.location);

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <img
          src={post.companyLogoURL || DEFAULT_LOGO}
          alt={post.companyName}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">{post.companyName}</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full shrink-0">
              <AppIcons.Stipend className="w-3 h-3" />
              {post.stipend === 0 ? "Unpaid" : `₹${post.stipend}/mo`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <MetaTag icon={AppIcons.Location}>{post.location}</MetaTag>
            <MetaTag icon={AppIcons.WorkMode} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
              {workMode}
            </MetaTag>
            <MetaTag icon={AppIcons.Duration}>{post.duration}</MetaTag>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="text-xs text-gray-400">+{skills.length - 4} more</span>
              )}
            </div>
          )}

          <p className="inline-flex items-center gap-1 text-xs text-gray-400 mt-3">
            <AppIcons.Calendar className="w-3.5 h-3.5" />
            Starts {safeFormatDate(post.startDate, "MMM d, yyyy") || "TBD"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
        <Link
          to={getInternshipUrl(post)}
          className="flex-1 sm:flex-none text-center px-4 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          View Details
        </Link>
        {hasApplied ? (
          <span className="flex-1 sm:flex-none text-center px-4 py-2 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium cursor-default">
            Already Applied
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(post._id)}
            className="flex-1 sm:flex-none px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Apply Now
          </button>
        )}
      </div>
    </article>
  );
};

export default InternshipCard;
