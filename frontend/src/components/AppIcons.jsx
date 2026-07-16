import { Link } from "react-router-dom";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineDocumentAdd,
  HiOutlineFilter,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineInbox,
  HiOutlineExclamationCircle,
  HiOutlineHeart,
  HiOutlineGlobeAlt,
  HiOutlineLogin,
  HiOutlineCamera,
  HiOutlineUpload,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
} from "react-icons/hi";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FiExternalLink, FiSearch, FiPlus, FiLogOut } from "react-icons/fi";

const iconClass = "w-4 h-4 shrink-0";

export const AppIcons = {
  Location: HiOutlineLocationMarker,
  Email: HiOutlineMail,
  Phone: HiOutlinePhone,
  LinkedIn: FaLinkedin,
  GitHub: FaGithub,
  Education: HiOutlineAcademicCap,
  Experience: HiOutlineBriefcase,
  Company: HiOutlineOfficeBuilding,
  About: HiOutlineUser,
  Skills: HiOutlineCodeBracket,
  Stipend: FaIndianRupeeSign,
  Duration: HiOutlineClock,
  Calendar: HiOutlineCalendar,
  WorkMode: HiOutlineGlobeAlt,
  ExternalLink: FiExternalLink,
  Search: FiSearch,
  Plus: FiPlus,
  Logout: FiLogOut,
  Home: HiOutlineHome,
  AboutPage: HiOutlineInformationCircle,
  Post: HiOutlineDocumentAdd,
  Filter: HiOutlineFilter,
  ChevronDown: HiOutlineChevronDown,
  ChevronLeft: HiOutlineChevronLeft,
  ChevronRight: HiOutlineChevronRight,
  Close: HiOutlineX,
  ArrowLeft: HiOutlineArrowLeft,
  Delete: HiOutlineTrash,
  Edit: HiOutlinePencil,
  Applicants: HiOutlineUserGroup,
  Document: HiOutlineDocumentText,
  Inbox: HiOutlineInbox,
  Alert: HiOutlineExclamationCircle,
  Heart: HiOutlineHeart,
  Login: HiOutlineLogin,
  Camera: HiOutlineCamera,
  Upload: HiOutlineUpload,
  Check: HiOutlineCheck,
  CheckCircle: HiOutlineCheckCircle,
  Lock: HiOutlineLockClosed,
  Unlock: HiOutlineLockOpen,
};

export const ProfileIcons = AppIcons;

export const IconBadge = ({ icon: Icon, className = "", iconClassName = "w-4 h-4" }) => (
  <span
    className={`w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 ${className}`}
  >
    <Icon className={iconClassName} />
  </span>
);

export const MetaItem = ({ icon: Icon, children, className = "" }) => (
  <span className={`inline-flex items-center gap-1.5 ${className}`}>
    <Icon className={iconClass} />
    {children}
  </span>
);

export const MetaTag = ({ icon: Icon, children, className = "px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md" }) => (
  <span className={`inline-flex items-center gap-1 ${className}`}>
    <Icon className="w-3.5 h-3.5 shrink-0" />
    {children}
  </span>
);

export const SocialLink = ({ href, icon: Icon, label, className = "" }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors ${className}`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span>{label}</span>
    <FiExternalLink className="w-3 h-3 opacity-60" />
  </a>
);

export const SectionTitle = ({ icon: Icon, children, className = "text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2" }) => (
  <h2 className={className}>
    <Icon className="w-4 h-4 text-purple-600 shrink-0" />
    {children}
  </h2>
);

export const LoadingSpinner = ({ className = "w-10 h-10" }) => (
  <div className={`${className} border-2 border-purple-600 border-t-transparent rounded-full animate-spin`} />
);

export const BackLink = ({ to = "/", children, className = "text-purple-600 hover:underline" }) => (
  <Link to={to} className={`inline-flex items-center gap-1.5 text-sm font-medium ${className}`}>
    <AppIcons.ArrowLeft className="w-4 h-4 shrink-0" />
    {children}
  </Link>
);

export const IconButton = ({ icon: Icon, label, className = "" }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <Icon className="w-4 h-4 shrink-0" />
    {label}
  </span>
);
