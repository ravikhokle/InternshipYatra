import { Link } from "react-router-dom";
import { PageContainer, SidebarMainRow } from "./ContentShell";

const FooterColumn = ({ title, links }) => (
  <div className="min-w-0">
    <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
    <ul className="space-y-2.5">
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
    <footer className="mt-auto w-full bg-gradient-to-r from-[#c599e52d] via-[#ca84fc38] to-[#e2ccf23c] border-t border-purple-100">
      <PageContainer className="py-10 sm:py-12">
        <SidebarMainRow
          sidebar={
            <>
              <Link
                to="/"
                className="text-xl md:text-2xl font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                InternshipYatra
              </Link>
              <p className="text-sm text-[#303030] mt-4 leading-relaxed">
                Browse internships, apply in one click, and share your profile and resume with recruiters who post roles on InternshipYatra.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-6">
                &copy; {year} InternshipYatra. All rights reserved.
              </p>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 w-full max-w-full">
            <FooterColumn title="For Students" links={studentLinks} />
            <FooterColumn title="For Recruiters" links={recruiterLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>
        </SidebarMainRow>
      </PageContainer>
    </footer>
  );
};

export default Footer;
