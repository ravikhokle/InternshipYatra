import { Link } from "react-router-dom";

const Footer = () => {
  return (

<footer className="sticky top-[90vh] bg-gradient-to-r from-[#c599e52d] from-7% via-[#ca84fc38] via-51% to-[#e2ccf23c] to-98% py-8 px-5 md:px-32 lg:px-32 text-[#303030]">
<div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 items-center md:items-start">
  
  {/* Section 1: Author Info */}
  <div className="flex flex-col gap-3 items-center md:items-start">
    <p className="text-lg font-semibold">Made with 🖤 by Ravi Khokle</p>
    <div className="flex flex-col gap-2">
      <p className="flex gap-2 items-center">
        <img src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079369/frontend/morvflgwmevg7f8mznch.png" alt="Linkedin Logo" className="w-5 h-5" />
        <Link
          className="text-blue-600 hover:underline"
          target="_blank"
          to="https://in.linkedin.com/in/ravikhokle"
        >
          Linkedin
        </Link>
      </p>
      <p className="flex gap-2 items-center">
        <img src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079368/frontend/k0mnhxfaajvxazphfeyx.png" alt="Github Logo" className="w-5 h-5" />
        <Link
          className="text-blue-600 hover:underline"
          target="_blank"
          to="https://github.com/ravikhokle"
        >
          GitHub
        </Link>
      </p>
    </div>
  </div>

  {/* Section 2: Center Text */}
  <div className="text-center md:text-left order-last md:order-none">
    <p className="text-sm md:text-base">
      &#169; {new Date().getFullYear()}{" "}
      <Link to="/" className="text-purple-600 hover:underline">
      InternshipYatra
      </Link>{" "}
      - All rights reserved.
    </p>
    <p className="text-xs md:text-sm text-gray-500">
      All logos and trademarks belong to their respective owners.
    </p>
  </div>

  {/* Section 3: Quick Links */}
  <div className="flex flex-col gap-2 items-center md:items-start">
    <h3 className="text-lg font-semibold">Quick Links</h3>
    <ul className="flex flex-col gap-1">
      <li>
        <Link
          to="/"
          className="text-purple-600 hover:underline"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/about"
          className="text-blue-600 hover:underline"
        >
          About
        </Link>
      </li>
      {/* <li>
        <Link
          to="/contact"
          className="text-blue-600 hover:underline"
        >
          Contact
        </Link>
      </li> */}
    </ul>
  </div>
</div>
</footer>

  );
};

export default Footer;
