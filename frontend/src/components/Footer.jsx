import { Link } from "react-router-dom";
import { PageContainer } from "./ContentShell";

const FooterColumn = ({ title, links }) => (
  <div className="min-w-0">
    <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
    <ul className="space-y-2 sm:space-y-2.5">
      {links.map(({ label, to, external }) => (
        <li key={label}>
          {external ? (
            <a
              href={to}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              {label}
            </a>
          ) : (
            <Link to={to} className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();

  const studentLinks = [
    { label: "Browse Internships", to: "/" },
    { label: "Create Account", to: "/signup" },
    { label: "Login", to: "/login" },
    { label: "My Profile", to: "/profile" },
  ];

  const recruiterLinks = [
    { label: "Post an Internship", to: "/createpost" },
    { label: "Company Profile", to: "/updateuserprofile" },
  ];

  const companyLinks = [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "LinkedIn", to: "https://in.linkedin.com/in/ravikhokle", external: true },
    { label: "GitHub", to: "https://github.com/ravikhokle", external: true },
  ];

  return (
    <footer className="relative z-20 mt-auto w-full bg-gradient-to-r from-[#c599e52d] via-[#ca84fc38] to-[#e2ccf23c] border-t border-purple-100">
      <PageContainer className="py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 min-w-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              InternshipYatra
            </Link>
            <p className="text-sm text-[#303030] mt-3 sm:mt-4 leading-relaxed max-w-md mx-auto sm:mx-0">
              Browse internships, apply in one click, and share your profile and resume with recruiters who post roles on InternshipYatra.
            </p>
          </div>

          <FooterColumn title="For Students" links={studentLinks} />
          <FooterColumn title="For Recruiters" links={recruiterLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="mt-8 pt-6 border-t border-purple-100/80 text-center ">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {year} InternshipYatra. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
